"use client"

import { Zap, Building2, Utensils, Fuel } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface MapLegendProps {
  visibleTypes: Record<string, boolean>
  onToggleType: (type: string) => void
}

export default function MapLegend({ visibleTypes, onToggleType }: MapLegendProps) {
  const legendItems = [
    {
      type: "ev-station",
      label: "EV Charging Stations",
      icon: <Zap className="h-4 w-4 text-white" />,
      color: "bg-green-600",
    },
    {
      type: "hospital",
      label: "Hospitals",
      icon: <Building2 className="h-4 w-4 text-white" />,
      color: "bg-red-600",
    },
    {
      type: "restaurant",
      label: "Restaurants",
      icon: <Utensils className="h-4 w-4 text-white" />,
      color: "bg-orange-600",
    },
    {
      type: "petrol-station",
      label: "Petrol/CNG Stations",
      icon: <Fuel className="h-4 w-4 text-white" />,
      color: "bg-blue-600",
    },
  ]

  return (
    <div className="space-y-2">
      {legendItems.map((item) => (
        <div key={item.type} className="flex items-center gap-2">
          <Checkbox
            id={`toggle-${item.type}`}
            checked={visibleTypes[item.type]}
            onCheckedChange={() => onToggleType(item.type)}
          />
          <div className="flex items-center gap-2">
            <div className={`${item.color} p-1 rounded-full`}>{item.icon}</div>
            <label htmlFor={`toggle-${item.type}`} className="text-sm cursor-pointer">
              {item.label}
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}
