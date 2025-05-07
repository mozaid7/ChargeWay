"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ArrowLeft, Search, BatteryCharging, Fuel, Utensils, Building2, Crosshair, X } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { fetchPOIs, calculateRoute } from "@/lib/api"
import type { POI } from "@/types/poi"

// Set mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

type MapViewProps = {
  mode: "route" | "nearby"
  startLocation: string
  endLocation?: string
  favorites: POI[]
  onToggleFavorite: (poi: POI) => void
  onReset: () => void
}

export default function MapView({
  mode,
  startLocation,
  endLocation,
  favorites,
  onToggleFavorite,
  onReset,
}: MapViewProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [pois, setPois] = useState<POI[]>([])
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [route, setRoute] = useState<any>(null)
  const [filteredPOIs, setFilteredPOIs] = useState<POI[]>([])
  const [filters, setFilters] = useState({
    evStation: true,
    hospital: false,
    restaurant: false,
    petrolStation: false,
  })
  const [showFavorites, setShowFavorites] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [startCoords, setStartCoords] = useState<[number, number]>([-74.006, 40.7128])
  const [endCoords, setEndCoords] = useState<[number, number] | undefined>()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const popupsRef = useRef<mapboxgl.Popup[]>([])
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)

  // Function to clear all markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    popupsRef.current.forEach((popup) => popup.remove())
    popupsRef.current = []
  }, [])

  // Initialize map
  useEffect(() => {
    if (!startLocation) return

    // Clean up function to be called on unmount or before re-initializing
    const cleanup = () => {
      clearMarkers()

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }

    // Geocode the locations
    const geocodeLocation = async (location: string): Promise<[number, number]> => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location,
          )}.json?access_token=${mapboxgl.accessToken}`,
        )
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          return data.features[0].center as [number, number]
        }
        return [-74.006, 40.7128] // Default to NYC if not found
      } catch (error) {
        console.error("Geocoding error:", error)
        return [-74.006, 40.7128] // Default to NYC
      }
    }

    const initializeMap = async () => {
      // Clean up existing map if any
      cleanup()

      setIsLoading(true)

      try {
        // Geocode locations
        const startCoordinates = await geocodeLocation(startLocation)
        setStartCoords(startCoordinates)

        let endCoordinates: [number, number] | undefined
        let routeData = null

        if (mode === "route" && endLocation) {
          endCoordinates = await geocodeLocation(endLocation)
          setEndCoords(endCoordinates)
          routeData = await calculateRoute(startCoordinates, endCoordinates)
          setRoute(routeData)
        }

        // Make sure the map container is empty
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = ""
        }

        // Initialize map
        mapInstanceRef.current = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: startCoordinates,
          zoom: 12,
          preserveDrawingBuffer: true, // Important for preventing disappearing markers
          attributionControl: false,
          antialias: true,
        })

        // Wait for map to load
        mapInstanceRef.current.on("load", async () => {
          // Add controls
          mapInstanceRef.current?.addControl(new mapboxgl.NavigationControl(), "bottom-right")
          mapInstanceRef.current?.addControl(new mapboxgl.FullscreenControl(), "bottom-right")
          mapInstanceRef.current?.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
            }),
            "bottom-right",
          )
          mapInstanceRef.current?.addControl(new mapboxgl.AttributionControl(), "bottom-left")

          // Add start marker
          new mapboxgl.Marker({ color: "#22c55e" })
            .setLngLat(startCoordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>Start: ${startLocation}</h3>`))
            .addTo(mapInstanceRef.current!)

          // Add end marker for route mode
          if (mode === "route" && endCoordinates && endLocation) {
            new mapboxgl.Marker({ color: "#ef4444" })
              .setLngLat(endCoordinates)
              .setPopup(new mapboxgl.Popup().setHTML(`<h3>End: ${endLocation}</h3>`))
              .addTo(mapInstanceRef.current!)

            // Add route line
            if (routeData && routeData.route) {
              try {
                // Create a proper GeoJSON object for the route
                const routeGeoJSON: GeoJSON.FeatureCollection = {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      properties: {},
                      geometry: routeData.route.geometry,
                    },
                  ],
                }

                // Check if source already exists
                if (mapInstanceRef.current && !mapInstanceRef.current.getSource("route")) {
                  // Add route source and layer
                  mapInstanceRef.current.addSource("route", {
                    type: "geojson",
                    data: routeGeoJSON,
                  })

                  mapInstanceRef.current.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": "#22c55e",
                      "line-width": 6,
                      "line-opacity": 0.8,
                    },
                  })
                } else {
                  // If source exists, update its data
                  if (mapInstanceRef.current) {
                    (mapInstanceRef.current.getSource("route") as mapboxgl.GeoJSONSource).setData(routeGeoJSON)
                  }
                }

                // Fit map to route
                const bounds = new mapboxgl.LngLatBounds()
                routeData.route.geometry.coordinates.forEach((coord: [number, number]) => {
                  bounds.extend(coord)
                })
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.fitBounds(bounds, { padding: 100 })
                }
              } catch (error) {
                console.error("Error adding route:", error)
              }
            }
          }

          // Set the map state
          setMap(mapInstanceRef.current)
        })

        // Add event listener for style.load to handle style changes
        mapInstanceRef.current.on("style.load", () => {
          // Re-add the route if it exists
          if (route && route.route && mapInstanceRef.current) {
            try {
              // Check if source already exists
              if (!mapInstanceRef.current.getSource("route")) {
                const routeGeoJSON: GeoJSON.FeatureCollection = {
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      properties: {},
                      geometry: route.route.geometry,
                    },
                  ],
                }

                mapInstanceRef.current.addSource("route", {
                  type: "geojson",
                  data: routeGeoJSON,
                })

                // Only add the layer if it doesn't exist
                if (!mapInstanceRef.current.getLayer("route")) {
                  mapInstanceRef.current.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": "#22c55e",
                      "line-width": 6,
                      "line-opacity": 0.8,
                    },
                  })
                }
              } else {
                // If source exists, update its data
                ;(mapInstanceRef.current.getSource("route") as mapboxgl.GeoJSONSource).setData({
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      properties: {},
                      geometry: route.route.geometry,
                    },
                  ],
                })
              }
            } catch (error) {
              console.error("Error re-adding route:", error)
            }
          }
        })

        // Fetch POIs
        const poiData = await fetchPOIs(startCoordinates, endCoordinates, routeData)
        setPois(poiData)
        setIsLoading(false)
      } catch (error) {
        console.error("Map initialization error:", error)
        setIsLoading(false)
      }
    }

    initializeMap()

    // Cleanup on unmount
    return cleanup
  }, [startLocation, endLocation, mode, clearMarkers])

  // Apply filters to POIs and update markers
  useEffect(() => {
    if (!pois.length || !map) return

    // First filter by type based on filters
    let filtered = pois.filter((poi) => {
      switch (poi.type) {
        case "ev-station":
          return filters.evStation
        case "hospital":
          return filters.hospital
        case "restaurant":
          return filters.restaurant
        case "petrol-station":
          return filters.petrolStation
        default:
          return false
      }
    })

    // Then filter by favorites if showFavorites is true
    if (showFavorites) {
      const favIds = favorites.map((fav) => fav.id)
      filtered = filtered.filter((poi) => favIds.includes(poi.id))
    }

    setFilteredPOIs(filtered)

    // Clear existing markers before adding new ones
    clearMarkers()

    // Add filtered POI markers
    filtered.forEach((poi) => {
      const isFavorite = favorites.some((fav) => fav.id === poi.id)

      // Create custom marker element
      const el = document.createElement("div")
      el.className = "poi-marker"
      el.style.width = "32px"
      el.style.height = "32px"
      el.style.borderRadius = "50%" // Make markers circular
      el.style.display = "flex"
      el.style.justifyContent = "center"
      el.style.alignItems = "center"
      el.style.cursor = "pointer"
      el.style.zIndex = "1" // Ensure markers are above the map

      // Set background color and icon based on POI type
      let bgColor = "#9ca3af"
      let icon = ""

      switch (poi.type) {
        case "ev-station":
          bgColor = "#22c55e"
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/></svg>`
          break
        case "hospital":
          bgColor = "#ef4444"
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/></svg>`
          break
        case "restaurant":
          bgColor = "#f59e0b"
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`
          break
        case "petrol-station":
          bgColor = "#3b82f6"
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`
          break
      }

      // Set marker style directly
      el.innerHTML = icon
      el.style.backgroundColor = bgColor

      // Add favorite indicator if needed
      if (isFavorite) {
        const favIndicator = document.createElement("div")
        favIndicator.style.position = "absolute"
        favIndicator.style.top = "-4px"
        favIndicator.style.right = "-4px"
        favIndicator.style.width = "12px"
        favIndicator.style.height = "12px"
        favIndicator.style.borderRadius = "50%"
        favIndicator.style.backgroundColor = "#f43f5e"
        favIndicator.style.border = "2px solid white"
        el.style.position = "relative"
        el.appendChild(favIndicator)
      }

      // Create popup but don't attach to marker yet
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true,
        offset: 25,
        maxWidth: "300px",
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-bold text-lg">${poi.name}</h3>
          <p class="text-gray-600 text-sm">${poi.address}</p>
          ${
            poi.type === "ev-station" && poi.connectors
              ? `<p class="text-sm mt-2"><span class="font-medium">Connectors:</span> ${poi.connectors.join(", ")}</p>`
              : ""
          }
          ${poi.status ? `<p class="text-sm mt-1"><span class="font-medium">Status:</span> ${poi.status}</p>` : ""}
          <div class="mt-3 flex justify-between">
            <button class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm" 
              onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}', '_blank')">
              Directions
            </button>
            <button class="favoriteBtn border border-red-500 ${isFavorite ? "bg-red-500 text-white" : "text-red-500"} px-3 py-1.5 rounded text-sm"
              data-poi-id="${poi.id}">
              ${isFavorite ? "Unfavorite" : "Favorite"}
            </button>
          </div>
        </div>
      `)

      // Add marker to map without popup
      const marker = new mapboxgl.Marker(el).setLngLat([poi.longitude, poi.latitude]).addTo(map)

      // Store marker reference for later cleanup
      markersRef.current.push(marker)

      // Show popup only when clicked
      el.addEventListener("click", (e) => {
        e.stopPropagation()
        setSelectedPOI(poi)

        // Close any open popups first
        popupsRef.current.forEach((p) => p.remove())
        popupsRef.current = []

        // Show popup at this location
        popup.setLngLat([poi.longitude, poi.latitude]).addTo(map)

        // Store popup reference
        popupsRef.current.push(popup)

        // Add event listener to favorite button after popup is added to DOM
        setTimeout(() => {
          const favBtn = document.querySelector(`.favoriteBtn[data-poi-id="${poi.id}"]`)
          if (favBtn) {
            favBtn.addEventListener("click", (e) => {
              e.stopPropagation()
              onToggleFavorite(poi)
              // Update button text/style immediately without waiting for re-render
              const newIsFavorite = !favorites.some((fav) => fav.id === poi.id)
              if (newIsFavorite) {
                favBtn.classList.add("bg-red-500", "text-white")
                favBtn.classList.remove("text-red-500")
                favBtn.textContent = "Unfavorite"
              } else {
                favBtn.classList.remove("bg-red-500", "text-white")
                favBtn.classList.add("text-red-500")
                favBtn.textContent = "Favorite"
              }
            })
          }
        }, 100)
      })
    })
  }, [pois, filters, map, favorites, showFavorites, clearMarkers, onToggleFavorite])

  // Add a useEffect to connect filter state to POI fetching
  // Add this after the existing useEffect hooks
  useEffect(() => {
    // When filters change, we don't need to refetch POIs
    // We just need to filter the existing ones
    if (!pois.length || !map) return

    // This effect only handles filtering and displaying markers
    // The actual fetching is done elsewhere
  }, [filters, pois, map, favorites, showFavorites, clearMarkers])

  // Handle filter changes
  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery,
        )}.json?access_token=${mapboxgl.accessToken}&limit=5`,
      )

      const data = await response.json()

      if (data.features && data.features.length > 0) {
        setSearchResults(data.features)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    }
  }

  // Handle selecting a search result
  const handleSelectLocation = async (feature: any) => {
    if (!map) return

    const newCoords: [number, number] = feature.center

    // Fly to the new location
    map.flyTo({
      center: newCoords,
      zoom: 14,
      essential: true,
    })

    // Update start coordinates
    setStartCoords(newCoords)

    // Fetch new POIs
    setIsLoading(true)
    try {
      const poiData = await fetchPOIs(newCoords, endCoords, route)
      setPois(poiData)
    } catch (error) {
      console.error("Error fetching POIs:", error)
    } finally {
      setIsLoading(false)
    }

    // Reset search
    setSearchQuery("")
    setSearchResults([])
    setShowSearch(false)
  }

  // Use current location
  const handleUseCurrentLocation = () => {
    setIsGettingLocation(true)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const newCoords: [number, number] = [longitude, latitude]

          if (map) {
            // Fly to the new location
            map.flyTo({
              center: newCoords,
              zoom: 14,
              essential: true,
            })

            // Update start coordinates
            setStartCoords(newCoords)

            // Fetch new POIs
            setIsLoading(true)
            try {
              const poiData = await fetchPOIs(newCoords, endCoords, route)
              setPois(poiData)
            } catch (error) {
              console.error("Error fetching POIs:", error)
            } finally {
              setIsLoading(false)
            }
          }

          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Geolocation error:", error)
          alert("Could not get your current location. Please try searching instead.")
          setIsGettingLocation(false)
        },
      )
    } else {
      alert("Geolocation is not supported by your browser. Please try searching instead.")
      setIsGettingLocation(false)
    }
  }

  // Focus search input when showing search
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  // Toggle favorites visibility
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <div className="relative h-full w-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-green-600 font-medium">Loading map data...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div id="map" ref={mapContainerRef} className="h-screen w-full"></div>

      {/* Top controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button onClick={onReset} className="bg-white hover:bg-gray-100 text-black shadow-md">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Button onClick={() => setShowSearch(true)} className="bg-white hover:bg-gray-100 text-black shadow-md">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>

        <Button
          onClick={handleUseCurrentLocation}
          disabled={isGettingLocation}
          className="bg-white hover:bg-gray-100 text-black shadow-md"
        >
          <Crosshair className="mr-2 h-4 w-4" />
          {isGettingLocation ? "Getting..." : "My Location"}
        </Button>
      </div>

      {/* Search panel */}
      {showSearch && (
        <div className="absolute top-16 left-4 z-20 bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Search Location</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSearch(false)
                setSearchResults([])
                setSearchQuery("")
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a location"
                  className="w-full p-2 pl-8 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="border rounded-md overflow-hidden bg-white">
              <p className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">Search results</p>
              <ul className="max-h-60 overflow-y-auto">
                {searchResults.map((feature) => (
                  <li
                    key={feature.id}
                    onClick={() => handleSelectLocation(feature)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-medium">{feature.text}</div>
                    <div className="text-sm text-gray-600">{feature.place_name}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Map filters - moved to top right */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md p-4 max-w-xs w-64">
        <h3 className="font-bold text-lg mb-3">Map Filters</h3>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ev-filter"
              checked={filters.evStation}
              onChange={() => toggleFilter("evStation")}
              className="mr-2 h-4 w-4 accent-green-600"
            />
            <label htmlFor="ev-filter" className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-green-600 rounded-full mr-2">
                <BatteryCharging className="h-3 w-3 text-white" />
              </span>
              EV Charging
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hospital-filter"
              checked={filters.hospital}
              onChange={() => toggleFilter("hospital")}
              className="mr-2 h-4 w-4 accent-red-500"
            />
            <label htmlFor="hospital-filter" className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full mr-2">
                <Building2 className="h-3 w-3 text-white" />
              </span>
              Hospitals
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="restaurant-filter"
              checked={filters.restaurant}
              onChange={() => toggleFilter("restaurant")}
              className="mr-2 h-4 w-4 accent-amber-500"
            />
            <label htmlFor="restaurant-filter" className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-amber-500 rounded-full mr-2">
                <Utensils className="h-3 w-3 text-white" />
              </span>
              Restaurants
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="petrol-filter"
              checked={filters.petrolStation}
              onChange={() => toggleFilter("petrolStation")}
              className="mr-2 h-4 w-4 accent-blue-500"
            />
            <label htmlFor="petrol-filter" className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full mr-2">
                <Fuel className="h-3 w-3 text-white" />
              </span>
              Fuel Stations
            </label>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-200">
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={toggleFavorites}
              className={`w-full ${showFavorites ? "bg-red-500 hover:bg-red-600" : "border-red-500 text-red-500"}`}
            >
              <Heart className={`mr-2 h-4 w-4 ${showFavorites ? "fill-white" : ""}`} />
              {showFavorites ? "Show All" : "Show Favorites"}
            </Button>
          </div>
        </div>

        {/* Route info */}
        {mode === "route" && route && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-1">Route Information:</h4>
            <p className="text-sm">Distance: {route.distance}</p>
            <p className="text-sm">Duration: {route.duration}</p>
          </div>
        )}
      </div>

      {/* Empty state when no favorites are visible */}
      {showFavorites && filteredPOIs.length === 0 && favorites.length > 0 && (
        <div className="absolute top-24 left-4 z-10 bg-white rounded-lg shadow-md p-4 max-w-xs">
          <div className="flex flex-col items-center py-4">
            <Heart className="h-12 w-12 mb-2 text-red-500 fill-red-500" />
            <p className="text-center">
              No favorites visible in this area. Adjust filters or zoom out to see your favorites.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
