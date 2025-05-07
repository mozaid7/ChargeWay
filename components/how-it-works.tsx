import { MapPin, Navigation, Zap, Heart } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center">
            <MapPin className="h-8 w-8" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sm">
            1
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Choose Your Location</h3>
        <p className="text-gray-600">
          Enter a destination to find nearby charging stations.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center">
            <Navigation className="h-8 w-8" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sm">
            2
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Explore the Map</h3>
        <p className="text-gray-600">
          Browse the interactive map to find charging stations and other amenities nearby.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center">
            <Zap className="h-8 w-8" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sm">
            3
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Get Details</h3>
        <p className="text-gray-600">
          View detailed information about each charging station, including availability and amenities.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center">
            <Heart className="h-8 w-8" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-sm">
            4
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Save Favorites</h3>
        <p className="text-gray-600">Save your favorite locations for quick access on future trips.</p>
      </div>
    </div>
  )
}
