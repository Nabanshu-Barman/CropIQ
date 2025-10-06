"use client"

import React, { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { getWeather, predictYield, PredictResult } from "../../services/yieldService"
import { LiveBadge } from "./yield/live-badge"
import { coordsForDistrict } from "@/lib/tn-districts-geo"

// Map (client-only)
const MapContainer = dynamic(() => import("../MapContainer").then((m) => m.default || m), { ssr: false })

function YieldPredictorInner() {
  const router = useRouter()

  // District and coords resolved from user selection
  const [district, setDistrict] = useState<string>("")
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  // Month and soil inputs
  const [month, setMonth] = useState<number | undefined>(undefined)
  const [N, setN] = useState<number>(50)
  const [P, setP] = useState<number>(40)
  const [K, setK] = useState<number>(45)
  const [pH, setPH] = useState<number>(6.5)

  // Weather and results
  const [wx, setWx] = useState<{ temperature_c: number; humidity_percent: number; rainfall_mm_24h: number } | null>(null)
  const [wxLoading, setWxLoading] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Resolve district and coords from localStorage (set during LocationSetup)
  useEffect(() => {
    const savedLocation = typeof window !== "undefined" ? localStorage.getItem("location") : null
    const savedDistrict = typeof window !== "undefined" ? localStorage.getItem("userDistrict") : null

    let d = ""
    try {
      d = savedDistrict || (savedLocation ? JSON.parse(savedLocation)?.district : "") || ""
    } catch {
      d = savedDistrict || ""
    }
    setDistrict(d)

    const c = coordsForDistrict(d) || { lat: 13.0827, lon: 80.2707 } // fallback Chennai
    setCoords(c)
  }, [])

  // Fetch weather when coords change
  useEffect(() => {
    const load = async () => {
      if (!coords) return
      setWxLoading(true)
      setError(null)
      try {
        const data = await getWeather(coords.lat, coords.lon)
        setWx(data)
      } catch (e: any) {
        setError(e.message || "Failed to load weather")
      } finally {
        setWxLoading(false)
      }
    }
    load()
  }, [coords?.lat, coords?.lon])

  const onPredict = async () => {
    if (!coords) {
      setError("No location set. Please ensure your district is saved after login.")
      return
    }
    setPredicting(true)
    setError(null)
    try {
      const payload = {
        nitrogen: N,
        phosphorous: P,
        potassium: K,
        ph: pH,
        lat: coords.lat,
        lng: coords.lon,
        month,
      }
      const res: PredictResult = await predictYield(payload)
      sessionStorage.setItem("yieldResult", JSON.stringify(res))
      sessionStorage.setItem("yieldInputs", JSON.stringify(payload))
      router.push("/dashboard/yield/result")
    } catch (e: any) {
      setError(e.message || "Prediction failed")
    } finally {
      setPredicting(false)
    }
  }

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({
        value: m,
        label: new Date(2000, m - 1, 1).toLocaleString(undefined, { month: "long" }),
      })),
    []
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium mb-1">Selected Location</div>
          <div className="text-xs text-muted-foreground">{district || "Not set"}</div>
          <div className="text-sm">{coords ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : "Resolving…"}</div>
        </div>
        <LiveBadge />
      </div>

      <div className="rounded-lg border map-frame" style={{ height: 360 }}>
        {coords && <MapContainer coords={coords} scrollWheelZoom={false} />}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 space-y-2">
          <div className="text-sm font-medium">Month (optional)</div>
          <select
            className="w-full border rounded px-2 py-1 text-sm"
            value={month ?? ""}
            onChange={(e) => setMonth(e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">Select month</option>
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <label className="text-sm font-medium">Nitrogen (N)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={N}
            onChange={(e) => setN(parseFloat(e.target.value))}
          />
          <label className="text-sm font-medium">Phosphorous (P)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={P}
            onChange={(e) => setP(parseFloat(e.target.value))}
          />
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <label className="text-sm font-medium">Potassium (K)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={K}
            onChange={(e) => setK(parseFloat(e.target.value))}
          />
          <label className="text-sm font-medium">Soil pH</label>
          <input
            type="number"
            step="0.1"
            className="w-full border rounded px-2 py-1"
            value={pH}
            onChange={(e) => setPH(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Live Weather (past 24h rain)</div>
          <div className="text-xs text-gray-500">{wxLoading ? "Refreshing…" : "Updated"}</div>
        </div>
        {wxLoading ? (
          <div className="text-sm text-gray-500 mt-2">Loading weather…</div>
        ) : wx ? (
          <div className="grid grid-cols-3 gap-4 text-sm mt-2">
            <div>
              <div className="text-gray-500">Temp</div>
              <div className="text-lg font-semibold">{wx.temperature_c.toFixed(1)} °C</div>
            </div>
            <div>
              <div className="text-gray-500">Humidity</div>
              <div className="text-lg font-semibold">{wx.humidity_percent.toFixed(0)} %</div>
            </div>
            <div>
              <div className="text-gray-500">Rain (24h)</div>
              <div className="text-lg font-semibold">{wx.rainfall_mm_24h.toFixed(1)} mm</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-2">No data</div>
        )}
      </div>

      <button
        onClick={onPredict}
        disabled={predicting || !coords}
        className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
      >
        {predicting ? "Predicting…" : "Predict Yield & Profit"}
      </button>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}

export default function YieldPredictor() {
  return <YieldPredictorInner />
}
export { YieldPredictor }