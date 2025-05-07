"use client"

import { Zap, Building2, Utensils, Fuel, Heart } from "lucide-react"

interface MapMarkerProps {
  type: string
  isFavorite: boolean
  onClick: () => void
}

export default function MapMarker({ type, isFavorite, onClick }: MapMarkerProps) {
  const getIcon = () => {
    switch (type) {
      case "ev-station":
        return <Zap className="h-4 w-4" />
      case "hospital":
        return <Building2 className="h-4 w-4" />
      case "restaurant":
        return <Utensils className="h-4 w-4" />
      case "petrol-station":
        return <Fuel className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getColor = () => {
    switch (type) {
      case "ev-station":
        return "bg-green-600"
      case "hospital":
        return "bg-red-600"
      case "restaurant":
        return "bg-orange-600"
      case "petrol-station":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <div className={`${getColor()} text-white p-2 rounded-full shadow-md`}>{getIcon()}</div>
      {isFavorite && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
        </div>
      )}
    </div>
  )
}
