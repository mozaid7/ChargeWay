"use client"

import { Heart, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { POI } from "@/types/poi"

interface MapPopupProps {
  poi: POI
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: () => void
}

export default function MapPopup({ poi, isFavorite, onClose, onToggleFavorite }: MapPopupProps) {
  return (
    <div className="p-2 min-w-[250px]">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{poi.name}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600">{poi.address}</p>
        {poi.type === "ev-station" && (
          <div className="mt-2">
            <p className="text-sm">
              <span className="font-medium">Connectors:</span> {poi.connectors?.join(", ") || "Unknown"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span> {poi.status || "Unknown"}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
          onClick={onToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500" : ""}`} />
          {isFavorite ? "Favorited" : "Favorite"}
        </Button>

        <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
          <a
            href={`https://maps.google.com/?q=${poi.latitude},${poi.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Directions
          </a>
        </Button>
      </div>
    </div>
  )
}
