export interface POI {
  id: string
  name: string
  type: string // "ev-station" | "hospital" | "restaurant" | "petrol-station"
  latitude: number
  longitude: number
  address: string
  connectors?: string[] // For EV stations
  status?: string // For EV stations
  source?: string // "openchargemap" | "tomtom" | "mock"
}
