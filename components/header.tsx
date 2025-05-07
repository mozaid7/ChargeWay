"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Zap, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Update active section based on scroll position
      const sections = ['features', 'how-it-works', 'about']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          } else if (window.scrollY < 100) {
            setActiveSection('home')
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", id: "home" },
    { href: "#features", label: "Features", id: "features" },
    { href: "#how-it-works", label: "How It Works", id: "how-it-works" },
    { href: "#about", label: "About", id: "about" }
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "border-b shadow-sm bg-white/90 backdrop-blur-md" 
          : "bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 transform transition-transform group-hover:rotate-12">
            <Image 
              src="/chargeway.png" 
              alt="Chargeway Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">
            <span className="text-green-400">Charge</span>
            <span className="text-green-700">way</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              href={item.href} 
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                activeSection === item.id
                  ? "text-green-600 bg-green-50"
                  : "text-gray-700 hover:text-green-600 hover:bg-green-50/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link href="/map">
            <Button className="bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2">
              Find Chargers
              <Zap className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation - Now with solid white background */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-50 bg-white transition-all duration-300 ease-in-out"
        >
          <nav className="flex flex-col gap-2 p-6 bg-white">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "text-lg font-medium p-3 rounded-lg transition-all duration-200",
                  activeSection === item.id
                    ? "bg-green-50 text-green-600"
                    : "hover:bg-green-50 text-gray-800"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/map" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg shadow-sm flex items-center justify-center gap-2">
                  Find Chargers
                  <Zap className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}