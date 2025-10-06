"use client"

import { useEffect, useState } from "react"

export type SavedLocation = { lat: number; lon: number } | null

export function useSavedLocation(): [SavedLocation, (loc: SavedLocation) => void] {
  const [loc, setLoc] = useState<SavedLocation>(null)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("userLocation") : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed.lat === "number" && typeof parsed.lon === "number") {
          setLoc({ lat: parsed.lat, lon: parsed.lon })
        }
      }
    } catch {}
  }, [])

  const save = (val: SavedLocation) => {
    setLoc(val)
    try {
      if (val) localStorage.setItem("userLocation", JSON.stringify(val))
      else localStorage.removeItem("userLocation")
    } catch {}
  }

  return [loc, save]
}