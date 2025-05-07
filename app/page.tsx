import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  Zap, 
  MapPin, 
  Navigation, 
  Clock, 
  Heart, 
  Shield, 
  ArrowRight, 
  Battery, 
  Leaf,
  Map
} from "lucide-react"
import FeatureCard from "@/components/feature-card"
import HowItWorks from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-green-50 via-green-100 to-white py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25px 25px, rgba(0, 128, 0, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 128, 0, 0.2) 2%, transparent 0%)", backgroundSize: "100px 100px" }}></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-12 items-center">
            <div className="flex flex-col justify-center space-y-6 lg:col-span-7">
              <div className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800 border border-green-200 shadow-sm">
                <div className="flex items-center">
                  <Leaf className="h-4 w-4 mr-2" />
                  <span>Eco-Friendly Navigation</span>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="relative h-16 w-16 mr-4">
                  <Image 
                    src="/chargeway.png" 
                    alt="Chargeway Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-6xl">
                  <span className="text-green-400">Charge</span>
                  <span className="text-green-700">way</span>
                </h1>
              </div>
              
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Find EV Charging <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Anywhere</span>
              </h2>
              
              <p className="max-w-[600px] text-gray-700 md:text-xl leading-relaxed">
                Locate the nearest electric vehicle charging stations, hospitals, restaurants, and more with our
                interactive map system designed for the modern EV driver.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link href="/map">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center">
                    Find Chargers 
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link href="#features">
                  <Button
                    variant="outline"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5 p-8">
              <div className="relative rounded-2xl bg-gradient-to-br from-green-200 to-green-50 p-1 shadow-xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="text-sm font-medium">Available</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="text-sm font-medium">Busy</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="text-sm font-medium">Offline</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">Downtown Supercharger</div>
                        <div className="text-sm text-gray-500">0.8 miles away</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">6/8 Available</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-6 w-6 text-yellow-600" />
                      <div>
                        <div className="font-medium">Central Plaza Station</div>
                        <div className="text-sm text-gray-500">1.2 miles away</div>
                      </div>
                    </div>
                    <div className="text-yellow-600 font-medium">2/4 Available</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <Battery className="h-6 w-6 text-green-600" />
                      <div>
                        <div className="font-medium">Riverside Charging</div>
                        <div className="text-sm text-gray-500">1.5 miles away</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">3/3 Available</div>
                  </div>
                  
                  <Link href="/map" className="flex items-center justify-center text-green-600 hover:text-green-700 font-medium">
                    View all nearby stations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-10 w-10 mr-2">
                <Image 
                  src="/chargeway.png" 
                  alt="Chargeway Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose <span className="text-green-600">Chargeway</span>
              </h2>
            </div>
            <p className="mt-4 text-gray-600 md:text-xl max-w-3xl mx-auto">
              Our platform offers comprehensive features to make your EV journey seamless and worry-free.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-green-600" />}
              title="Find Charging Stations"
              description="Locate the nearest EV charging stations with real-time availability information."
            />
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-green-600" />}
              title="Discover Amenities"
              description="Find restaurants, hospitals, and other amenities near charging stations."
            />
            <FeatureCard
              icon={<Navigation className="h-10 w-10 text-green-600" />}
              title="Plan Your Route"
              description="Plan your journey with optimal charging stops along the way."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-green-600" />}
              title="Real-time Updates"
              description="Get real-time updates on charging station availability and wait times."
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10 text-green-600" />}
              title="Save Favorites"
              description="Save your favorite locations for quick access on future trips."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-green-600" />}
              title="Verified Information"
              description="All our data is verified and regularly updated for accuracy."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-green-50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25px 25px, rgba(0, 128, 0, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 128, 0, 0.2) 2%, transparent 0%)", backgroundSize: "100px 100px" }}></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-10 w-10 mr-2">
                <Image 
                  src="/chargeway.png" 
                  alt="Chargeway Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How <span className="text-green-600">It Works</span>
              </h2>
            </div>
            <p className="mt-4 text-gray-600 md:text-xl max-w-3xl mx-auto">
              Finding charging stations and planning your route is simple with Chargeway.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
            </div>
          </div>

          <HowItWorks />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center mb-8">
            <div className="relative h-12 w-12 mr-3">
              <Image 
                src="/chargeway.png" 
                alt="Chargeway Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Chargeway by the Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10k+</div>
              <div className="text-gray-600">Charging Stations</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50k+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100k+</div>
              <div className="text-gray-600">Routes Planned</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-8 w-8 mr-2">
                <Image 
                  src="/chargeway.png" 
                  alt="Chargeway Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                What Our Users <span className="text-green-600">Say</span>
              </h2>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">JD</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-gray-500">Tesla Model 3 Owner</p>
                </div>
              </div>
              <p className="text-gray-600">"Chargeway has made my long-distance EV trips so much easier. I can find charging stations along my route and plan my stops efficiently."</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">JS</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Nissan Leaf Owner</p>
                </div>
              </div>
              <p className="text-gray-600">"I love that I can see real-time availability of charging stations. No more surprises when I arrive at a station only to find all chargers in use."</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">RJ</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">Robert Johnson</h4>
                  <p className="text-sm text-gray-500">Chevrolet Bolt Owner</p>
                </div>
              </div>
              <p className="text-gray-600">"The feature that shows amenities near charging stations is fantastic. I can grab lunch or shop while my car charges. Great time-saver!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500"></div>
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="relative h-24 w-24 bg-white rounded-full p-2 shadow-lg">
              <Image 
                src="/chargeway.png" 
                alt="Chargeway Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="max-w-[600px] text-green-50 md:text-xl">
              Join thousands of EV drivers who use Chargeway to find charging stations and plan their routes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/map">
                <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center">
                  Find Chargers 
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  className="border-2 border-white text-white bg-transparent hover:bg-white/10 px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}