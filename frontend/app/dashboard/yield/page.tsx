"use client"

import React from "react"
import YieldPredictor from "../../../components/dashboard/yield-predictor"

export default function YieldPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Yield Predictor</h1>
        <p className="text-sm text-gray-600">Live recommendation based on your saved location and current weather.</p>
      </div>
      <YieldPredictor />
    </div>
  )
}