import type { POI } from "@/types/poi"

// Helper function to deduplicate POIs
function deduplicatePOIs(pois: POI[]): POI[] {
  const uniquePOIs = new Map<string, POI>()

  pois.forEach((poi) => {
    // Create a unique key based on name and coordinates (with some tolerance)
    const roundedLat = Math.round(poi.latitude * 10000) / 10000
    const roundedLng = Math.round(poi.longitude * 10000) / 10000
    const key = `${poi.name.toLowerCase().trim()}_${roundedLat}_${roundedLng}`

    // Only add if not already in the map, or if this one has more details
    if (!uniquePOIs.has(key) || (poi.type === "ev-station" && uniquePOIs.get(key)?.type !== "ev-station")) {
      uniquePOIs.set(key, poi)
    }
  })

  return Array.from(uniquePOIs.values())
}

// Cache for API responses to avoid duplicate requests
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Fetch with caching and rate limiting
async function fetchWithCache(url: string, options: RequestInit = {}, cacheKey?: string): Promise<Response> {
  const key = cacheKey || url
  const cached = apiCache.get(key)

  // Return cached data if available and not expired
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }

  // Add a small random delay to avoid hitting rate limits
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 100))

  const response = await fetch(url, options)

  // Cache successful responses
  if (response.ok) {
    const clonedResponse = response.clone()
    const data = await clonedResponse.json()
    apiCache.set(key, { data, timestamp: Date.now() })
  }

  return response
}

// Fetch EV charging stations from OpenChargeMap API
async function fetchEVStations(latitude: number, longitude: number, distance = 10): Promise<POI[]> {
  const cacheKey = `ev-stations-${latitude}-${longitude}-${distance}`

  try {
    const response = await fetchWithCache(
      `https://api.openchargemap.io/v3/poi/?output=json&latitude=${latitude}&longitude=${longitude}&distance=${distance}&distanceunit=km&maxresults=50`,
      {
        headers: {
          "X-API-Key": process.env.NEXT_PUBLIC_OPEN_CHARGE_MAP_API_KEY || "",
        },
      },
      cacheKey,
    )

    if (!response.ok) {
      throw new Error(`OpenChargeMap API error: ${response.status}`)
    }

    const data = await response.json()

    return data.map((station: any) => ({
      id: `ocm-${station.ID}`,
      name: station.AddressInfo?.Title || "Unknown Station",
      type: "ev-station",
      latitude: station.AddressInfo?.Latitude,
      longitude: station.AddressInfo?.Longitude,
      address: [
        station.AddressInfo?.AddressLine1,
        station.AddressInfo?.Town,
        station.AddressInfo?.StateOrProvince,
        station.AddressInfo?.Postcode,
      ]
        .filter(Boolean)
        .join(", "),
      connectors: station.Connections?.map((conn: any) => conn.ConnectionType?.Title).filter(Boolean) || [],
      status: station.StatusType?.Title || "Unknown",
      source: "openchargemap",
    }))
  } catch (error) {
    console.error("Error fetching from OpenChargeMap:", error)
    return []
  }
}

// Fetch POIs from TomTom API with rate limiting
async function fetchTomTomPOIs(latitude: number, longitude: number, category: string, radius = 10000): Promise<POI[]> {
  const cacheKey = `tomtom-${category}-${latitude}-${longitude}-${radius}`

  try {
    const response = await fetchWithCache(
      `https://api.tomtom.com/search/2/categorySearch/${category}.json?lat=${latitude}&lon=${longitude}&radius=${radius}&limit=20&key=${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`,
      {},
      cacheKey,
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`TomTom API rate limit exceeded for ${category}`)
        return [] // Return empty array instead of throwing
      }
      throw new Error(`TomTom API error: ${response.status}`)
    }

    const data = await response.json()

    // Map TomTom categories to our POI types
    const categoryToType: Record<string, string> = {
      hospital: "hospital",
      restaurant: "restaurant",
      "petrol station": "petrol-station",
      "charging station": "ev-station",
    }

    return data.results.map((poi: any) => {
      // Determine POI type based on category
      let type = "other"
      const poiCategory = poi.poi?.categories?.[0]?.toLowerCase() || ""

      if (poiCategory.includes("hospital") || poiCategory.includes("medical")) {
        type = "hospital"
      } else if (poiCategory.includes("restaurant") || poiCategory.includes("food")) {
        type = "restaurant"
      } else if (poiCategory.includes("petrol") || poiCategory.includes("gas") || poiCategory.includes("cng")) {
        type = "petrol-station"
      } else if (poiCategory.includes("charging") || poiCategory.includes("ev")) {
        type = "ev-station"
      } else {
        type = categoryToType[category] || "other"
      }

      return {
        id: `tomtom-${poi.id}`,
        name: poi.poi?.name || "Unknown Location",
        type,
        latitude: poi.position.lat,
        longitude: poi.position.lon,
        address: poi.address?.freeformAddress || "",
        source: "tomtom",
      }
    })
  } catch (error) {
    console.error(`Error fetching ${category} from TomTom:`, error)
    return []
  }
}

// Create search points along the route
function createSearchPointsAlongRoute(route: any, numPoints = 6): [number, number][] {
  if (!route || !route.geometry || !route.geometry.coordinates || route.geometry.coordinates.length < 2) {
    return []
  }

  const coordinates = route.geometry.coordinates
  const totalPoints = coordinates.length
  const searchPoints: [number, number][] = []

  // Always include start point
  searchPoints.push(coordinates[0])

  // Add evenly distributed points along the route
  if (totalPoints > 2) {
    const step = Math.max(1, Math.floor(totalPoints / (numPoints - 2)))

    for (let i = step; i < totalPoints - 1; i += step) {
      searchPoints.push(coordinates[i])
    }
  }

  // Always include the end point
  searchPoints.push(coordinates[totalPoints - 1])

  return searchPoints
}

// Fetch POIs from both APIs and combine results
export async function fetchPOIs(
  startCoords: [number, number],
  endCoords?: [number, number],
  route?: any,
): Promise<POI[]> {
  try {
    let searchPoints: [number, number][] = [startCoords]
    let searchRadius = 5 // km

    // If we have a route, create search points along the route
    if (endCoords && route && route.geometry && route.geometry.coordinates) {
      // Create search points along the route for better coverage
      searchPoints = createSearchPointsAlongRoute(route, 6) // Reduced number of points to avoid rate limiting

      // If we don't have enough points from the route, ensure we at least have start and end
      if (searchPoints.length < 2 && endCoords) {
        searchPoints = [startCoords, endCoords]
      }

      // Adjust search radius based on route length
      const routeLength = route.distance_meters / 1000 // km
      searchRadius = Math.max(3, Math.min(10, routeLength / 20))
    } else if (endCoords) {
      // If we have end coordinates but no route, include both start and end
      searchPoints = [startCoords, endCoords]
    }

    console.log(`Searching at ${searchPoints.length} points along route with radius ${searchRadius}km`)

    // Fetch POIs for all search points
    const allPOIs: POI[] = []

    // Process each search point sequentially to avoid rate limiting
    for (const [lng, lat] of searchPoints) {
      // Fetch EV stations first (priority)
      const evStations = await fetchEVStations(lat, lng, searchRadius)
      allPOIs.push(...evStations)

      // Only fetch other POI types if we have capacity (to avoid rate limiting)
      // We prioritize EV stations since that's the main focus

      // Fetch EV stations from TomTom as a backup
      const tomtomEVStations = await fetchTomTomPOIs(lat, lng, "charging station", searchRadius * 1000)
      allPOIs.push(...tomtomEVStations)

      // Only fetch other POI types if specifically requested
      // This would ideally be connected to your UI filters
      const shouldFetchRestaurants = true
      const shouldFetchHospitals = true
      const shouldFetchPetrolStations = true

      if (shouldFetchHospitals) {
        const hospitals = await fetchTomTomPOIs(lat, lng, "hospital", searchRadius * 1000)
        allPOIs.push(...hospitals)
      }

      if (shouldFetchRestaurants) {
        const restaurants = await fetchTomTomPOIs(lat, lng, "restaurant", searchRadius * 1000)
        allPOIs.push(...restaurants)
      }

      if (shouldFetchPetrolStations) {
        const petrolStations = await fetchTomTomPOIs(lat, lng, "petrol station", searchRadius * 1000)
        allPOIs.push(...petrolStations)
      }
    }

    // Deduplicate POIs
    const uniquePOIs = deduplicatePOIs(allPOIs)
    console.log(`Found ${uniquePOIs.length} unique POIs along the route`)

    return uniquePOIs
  } catch (error) {
    console.error("Error fetching POIs:", error)

    // Return mock data as fallback
    return mockPOIs.map((poi) => ({
      ...poi,
      latitude: startCoords[1] + (Math.random() * 0.02 - 0.01),
      longitude: startCoords[0] + (Math.random() * 0.02 - 0.01),
    }))
  }
}

// Calculate a route between two points using Mapbox Directions API
export async function calculateRoute(start: [number, number], end: [number, number]) {
  const isValidCoordinate = (coord: [number, number]) =>
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    typeof coord[1] === "number" &&
    !isNaN(coord[0]) &&
    !isNaN(coord[1]);

  if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
    console.error("Invalid coordinates passed to calculateRoute:", { start, end });
    throw new Error("Invalid coordinates for route calculation.");
  }

  const formatCoord = (coord: number) => Number(coord).toFixed(6);
  const formattedStart = `${formatCoord(start[0])},${formatCoord(start[1])}`;
  const formattedEnd = `${formatCoord(end[0])},${formatCoord(end[1])}`;
  const cacheKey = `route-${formattedStart}-${formattedEnd}`;

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${formattedStart};${formattedEnd}?geometries=geojson&overview=full&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;

    const response = await fetchWithCache(url, {}, cacheKey);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Mapbox API returned an error:", errData);
      throw new Error(`Mapbox Directions API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(1);
    const durationMin = Math.round(route.duration / 60);
    const hours = Math.floor(durationMin / 60);
    const minutes = durationMin % 60;
    const formattedDuration = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

    return {
      route: {
        type: "Feature",
        geometry: route.geometry,
        properties: {},
      },
      distance: `${distanceKm} km`,
      duration: formattedDuration,
      distance_meters: route.distance,
    };
  } catch (error) {
    console.error("Error calculating route:", error);

    // Fallback to mock route
    const numPoints = 20;
    const coordinates = [];

    for (let i = 0; i <= numPoints; i++) {
      const ratio = i / numPoints;
      coordinates.push([
        start[0] + (end[0] - start[0]) * ratio + (Math.random() - 0.5) * 0.01,
        start[1] + (end[1] - start[1]) * ratio + (Math.random() - 0.5) * 0.01,
      ]);
    }

    const distance = `${Math.round(Math.random() * 50 + 10)} km`;
    const duration = `${Math.round(Math.random() * 60 + 30)} min`;

    return {
      route: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: {},
      },
      distance,
      duration,
      distance_meters: 10000,
    };
  }
}


// Mock data for fallback
const mockPOIs: POI[] = [
  {
    id: "1",
    name: "Downtown EV Charging Hub",
    type: "ev-station",
    latitude: 31.1471,
    longitude: 75.3412,
    address: "123 Main St, New York, NY",
    connectors: ["CCS", "CHAdeMO", "Type 2"],
    status: "Available",
    source: "mock",
  },
  {
    id: "2",
    name: "City Hospital",
    type: "hospital",
    latitude: 40.714,
    longitude: -74.005,
    address: "456 Health Ave, New York, NY",
    source: "mock",
  },
  {
    id: "3",
    name: "Green Leaf Restaurant",
    type: "restaurant",
    latitude: 40.715,
    longitude: -74.008,
    address: "789 Food St, New York, NY",
    source: "mock",
  },
  {
    id: "4",
    name: "Central Gas Station",
    type: "petrol-station",
    latitude: 40.713,
    longitude: -74.002,
    address: "321 Fuel Rd, New York, NY",
    source: "mock",
  },
]
