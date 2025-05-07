"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, ArrowRight, Search, Star, ChevronLeft, Compass } from "lucide-react"
import LocationSelector from "@/components/location-selector"
import MapView from "@/components/map-view"
import { useFavorites } from "@/hooks/use-favorites"
import type { POI } from "@/types/poi"
import { Button } from "@/components/ui/button"

export default function MapPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedOption, setSelectedOption] = useState<"route" | "nearby" | null>(null)
  const [startLocation, setStartLocation] = useState<string>("")
  const [endLocation, setEndLocation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [pois, setPois] = useState<POI[]>([])
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(true)
  }, [])

  const handleOptionSelect = (option: "route" | "nearby") => {
    setSelectedOption(option)
  }

  const handleLocationSelect = (start: string, end?: string) => {
    setStartLocation(start)
    if (end) setEndLocation(end)
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 1000)
  }

  const handleReset = () => {
    setStep(1)
    setSelectedOption(null)
    setStartLocation("")
    setEndLocation("")
  }

  const handleToggleFavorite = (poi: POI) => {
    const isFavorite = favorites.some((fav) => fav.id === poi.id)

    if (isFavorite) {
      removeFavorite(poi.id)
    } else {
      addFavorite(poi)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      <main className="flex-1">
        {step === 1 ? (
          <section className="py-16 md:py-24 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle at 25px 25px, rgba(34, 197, 94, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(34, 197, 94, 0.15) 2%, transparent 0%)",
                backgroundSize: "100px 100px"
              }}></div>
            </div>

            <div className={`container px-4 md:px-6 max-w-5xl mx-auto relative z-10 transition-all duration-700 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                  <Compass className="h-4 w-4 mr-2" />
                  <span>Interactive Map</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
                  Find <span className="text-green-600">Charging Stations</span>
                </h1>
                <p className="mt-4 text-gray-600 md:text-xl max-w-2xl mx-auto">
                  Locate EV charging stations, plan routes, and discover nearby amenities with our interactive map.
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 mt-12">
                <button
                  onClick={() => handleOptionSelect("route")}
                  className={`p-8 border-2 rounded-2xl text-left transition-all duration-300 group hover:translate-y-[-4px] ${
                    selectedOption === "route"
                      ? "border-green-600 bg-green-50 shadow-lg"
                      : "border-gray-200 hover:border-green-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`p-3 rounded-xl ${selectedOption === "route" ? "bg-green-100" : "bg-gray-100 group-hover:bg-green-50"} transition-colors`}>
                      <Navigation className={`h-8 w-8 ${selectedOption === "route" ? "text-green-600" : "text-gray-600 group-hover:text-green-600"} transition-colors`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Plan a Route</h3>
                      <p className="text-gray-600 mt-2">Find the optimal path with charging stations along your journey.</p>
                      <div className={`mt-4 flex items-center text-sm font-medium ${selectedOption === "route" ? "text-green-600" : "text-gray-500"}`}>
                        <span>Get directions</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleOptionSelect("nearby")}
                  className={`p-8 border-2 rounded-2xl text-left transition-all duration-300 group hover:translate-y-[-4px] ${
                    selectedOption === "nearby"
                      ? "border-green-600 bg-green-50 shadow-lg"
                      : "border-gray-200 hover:border-green-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`p-3 rounded-xl ${selectedOption === "nearby" ? "bg-green-100" : "bg-gray-100 group-hover:bg-green-50"} transition-colors`}>
                      <MapPin className={`h-8 w-8 ${selectedOption === "nearby" ? "text-green-600" : "text-gray-600 group-hover:text-green-600"} transition-colors`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Find Nearby Stations</h3>
                      <p className="text-gray-600 mt-2">Discover charging stations and amenities near your location.</p>
                      <div className={`mt-4 flex items-center text-sm font-medium ${selectedOption === "nearby" ? "text-green-600" : "text-gray-500"}`}>
                        <span>Explore nearby</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {selectedOption && (
                <div className={`mt-10 p-8 border-2 border-gray-200 rounded-2xl bg-white shadow-md transition-all duration-500 transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="flex items-center mb-6">
                    <div className="p-2 rounded-lg bg-green-100">
                      {selectedOption === "route" ? (
                        <Navigation className="h-5 w-5 text-green-600" />
                      ) : (
                        <Search className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold ml-3">
                      {selectedOption === "route" ? "Plan Your Route" : "Find Nearby Stations"}
                    </h3>
                  </div>

                  <LocationSelector mode={selectedOption} onLocationSelect={handleLocationSelect} />

                  {selectedOption === "route" && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-sm text-green-700 flex items-start">
                        <Star className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                        <span>Pro Tip: Our route planner optimizes your journey by considering charging times and battery usage.</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium">Loading map data...</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="relative">
            <Button 
              onClick={handleReset} 
              className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 shadow-md rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <MapView
              mode={selectedOption || "nearby"}
              startLocation={startLocation}
              endLocation={endLocation}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  )
}