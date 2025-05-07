"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface LocationSelectorProps {
  mode: "route" | "nearby"
  onLocationSelect: (startLocation: string, endLocation?: string) => void
}

export default function LocationSelector({ mode, onLocationSelect }: LocationSelectorProps) {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "route" && startLocation.trim() && endLocation.trim()) {
      setIsLoading(true)
      onLocationSelect(startLocation, endLocation)
    } else if (mode === "nearby" && startLocation.trim()) {
      setIsLoading(true)
      onLocationSelect(startLocation)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          placeholder={mode === "route" ? "Enter starting point" : "Enter city"}
          className="pl-10"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          required
        />
      </div>

      {mode === "route" && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Enter destination"
            className="pl-10"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            required
          />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading || !startLocation.trim() || (mode === "route" && !endLocation.trim())}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "route" ? "Planning Route..." : "Searching..."}
          </>
        ) : (
          <>{mode === "route" ? "Plan Route" : "Search"}</>
        )}
      </Button>

      <p className="text-xs text-gray-500">
        {mode === "route"
          ? "Enter your starting point and destination to find charging stations along your route."
          : "Enter a city to find charging stations nearby."}
      </p>
    </form>
  )
}