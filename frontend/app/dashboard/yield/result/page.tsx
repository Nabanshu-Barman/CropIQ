"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useNow } from "../../../../hooks/useNow"
import { LiveBadge } from "../../../../components/dashboard/yield/live-badge"
import { cropDescription, cropImageSrc } from "@/lib/crop-info"

export default function YieldResultPage() {
  const [result, setResult] = useState<any>(null)
  const [inputs, setInputs] = useState<any>(null)
  const now = useNow(1000)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("yieldResult")
      const rawIn = sessionStorage.getItem("yieldInputs")
      if (raw) setResult(JSON.parse(raw))
      if (rawIn) setInputs(JSON.parse(rawIn))
    } catch {}
  }, [])

  const dateTime = useMemo(
    () => now.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
    [now]
  )

  if (!result) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Yield Recommendation</h1>
        <p className="text-gray-600">No result found. Please run a prediction first.</p>
        <Link className="text-emerald-600 underline" href="/dashboard/yield">Go back to predictor</Link>
      </div>
    )
  }

  const crop = result.crop as string
  const conf = (result.confidence * 100).toFixed(2) + "%"
  const profit = Math.round(result.profit_per_acre_rs).toLocaleString()
  const yieldQ = result.estimated_yield_quintal_per_acre
  const revenue = result.estimated_revenue_rs != null ? Math.round(result.estimated_revenue_rs).toLocaleString() : "—"
  const cost = result.estimated_cost_rs != null ? Math.round(result.estimated_cost_rs).toLocaleString() : "—"
  const tips: string[] = Array.isArray(result.techniques) ? result.techniques : []

  const description = cropDescription(crop)
  const imgSrc = cropImageSrc(crop)

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 space-y-8">
      {/* Header with LIVE and timestamp */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yield Recommendation</h1>
          <p className="text-gray-600">Based on your live weather and soil inputs.</p>
        </div>
        <div className="flex items-center gap-3">
          <LiveBadge />
          <div className="text-xs text-gray-500">{dateTime}</div>
        </div>
      </div>

      {/* Hero card with crop image + summary */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.12),transparent_40%)]" />
        <div className="relative p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Image (no cropping; always fully visible) */}
            <div className="order-2 md:order-1">
              <div className="relative w-full h-80 sm:h-96 lg:h-[28rem] xl:h-[32rem] rounded-xl overflow-hidden border bg-white/80 shadow-sm flex items-center justify-center p-2">
                <Image
                  src={imgSrc}
                  alt={`${crop} image`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right: Text summary */}
            <div className="order-1 md:order-2 flex flex-col gap-4">
              <div>
                <div className="text-sm text-gray-500">Recommended Crop</div>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight mt-1">{crop}</div>
                <div className="mt-2 text-sm text-gray-600">
                  Model confidence: <span className="font-semibold text-emerald-700">{conf}</span>
                </div>
              </div>
              <div className="rounded-xl border bg-white/70 backdrop-blur p-5 shadow-sm">
                <div className="text-sm text-gray-500">Estimated Profit (per acre)</div>
                <div className="text-3xl md:text-4xl font-extrabold text-emerald-700 mt-1">₹ {profit}</div>
              </div>
              <div className="text-sm text-gray-700">{description}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="rounded-xl border p-5 bg-white shadow-sm transition hover:shadow-md">
          <div className="text-xs text-gray-500">Estimated Yield</div>
          <div className="mt-1 text-2xl font-semibold">{yieldQ != null ? `${yieldQ} q/acre` : "—"}</div>
        </div>
        <div className="rounded-xl border p-5 bg-white shadow-sm transition hover:shadow-md">
          <div className="text-xs text-gray-500">Estimated Revenue</div>
          <div className="mt-1 text-2xl font-semibold">₹ {revenue}</div>
        </div>
        <div className="rounded-xl border p-5 bg-white shadow-sm transition hover:shadow-md">
          <div className="text-xs text-gray-500">Estimated Cost</div>
          <div className="mt-1 text-2xl font-semibold">₹ {cost}</div>
        </div>
      </div>

      {/* Echo context */}
      {inputs && (
        <div className="rounded-xl border p-5 bg-white shadow-sm">
          <div className="text-sm font-semibold mb-1">Context</div>
          <div className="text-sm text-gray-600">
            Location: {Number(inputs.lat).toFixed(4)}, {Number(inputs.lng).toFixed(4)} ·
            &nbsp;N: {inputs.nitrogen} · P: {inputs.phosphorous} · K: {inputs.potassium} · pH: {inputs.ph}
            {inputs.month ? <> · Month: {inputs.month}</> : null}
          </div>
          {result.weather_used && (
            <div className="mt-2 text-xs text-gray-500">
              Weather: {result.weather_used.temperature_c?.toFixed?.(1)}°C, {result.weather_used.humidity_percent?.toFixed?.(0)}% RH,
              {" "}{result.weather_used.rainfall_mm_24h?.toFixed?.(1)} mm rain (24h)
            </div>
          )}
        </div>
      )}

      {/* Techniques */}
      <div className="rounded-xl border p-5 bg-white shadow-sm">
        <div className="text-lg font-semibold mb-3">Planting Techniques</div>
        <ul className="list-disc pl-5 space-y-1">
          {tips.map((t, i) => (
            <li key={i} className="text-sm">{t}</li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/yield"
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition shadow-sm"
        >
          ← New Prediction
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}