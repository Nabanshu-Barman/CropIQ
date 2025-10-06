"use client"

import React from "react"

type Props = {
  crop: string
  confidence: number
  profitPerAcreRs: number
  yieldQPerAcre?: number
  revenueRs?: number
  costRs?: number
  techniques: string[]
}

export function YieldResults({
  crop,
  confidence,
  profitPerAcreRs,
  yieldQPerAcre,
  revenueRs,
  costRs,
  techniques,
}: Props) {
  const pct = (confidence * 100).toFixed(2)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h3 className="text-xl font-semibold">Recommended Crop</h3>
        <p className="text-3xl font-bold mt-2">{crop}</p>
        <p className="text-sm text-muted-foreground mt-1">Model confidence: {pct}%</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Estimated Profit (per acre)</div>
          <div className="text-2xl font-semibold">₹ {profitPerAcreRs.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Estimated Yield</div>
          <div className="text-2xl font-semibold">
            {yieldQPerAcre != null ? `${yieldQPerAcre} q/acre` : "—"}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Revenue / Cost</div>
          <div className="text-2xl font-semibold">
            {revenueRs != null && costRs != null ? `₹ ${Math.round(revenueRs).toLocaleString()} / ₹ ${Math.round(costRs).toLocaleString()}` : "—"}
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h4 className="text-lg font-semibold mb-2">Planting Techniques</h4>
        <ul className="list-disc pl-5 space-y-1">
          {techniques.map((t, i) => (
            <li key={i} className="text-sm">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}