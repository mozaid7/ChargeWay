"use client"

import { useState, useEffect } from "react"
import type { POI } from "@/types/poi"

export function useFavorites() {
  const [favorites, setFavorites] = useState<POI[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("chargeway-favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Error parsing favorites:", error)
      }
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("chargeway-favorites", JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (poi: POI) => {
    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((fav) => fav.id === poi.id)) {
        return prev
      }
      return [...prev, poi]
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  return { favorites, addFavorite, removeFavorite }
}
