export type Weather = {
  temperature_c: number
  humidity_percent: number
  rainfall_mm_24h: number
}

export type PredictPayload = {
  nitrogen: number
  phosphorous: number
  potassium: number
  ph: number
  lat: number
  lng: number
  month?: number
}

export type PredictResult = {
  crop: string
  confidence: number
  profit_per_acre_rs: number
  estimated_yield_quintal_per_acre?: number
  estimated_revenue_rs?: number
  estimated_cost_rs?: number
  techniques: string[]
  inputs_echoed: Record<string, any>
  weather_used: Weather
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function getWeather(lat: number, lng: number): Promise<Weather> {
  const url = `${BASE_URL}/api/yield/weather?lat=${lat}&lng=${lng}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Weather error: ${res.status}`)
  return res.json()
}

export async function predictYield(payload: PredictPayload): Promise<PredictResult> {
  const url = `${BASE_URL}/api/yield/predict`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Predict error: ${res.status} ${text}`)
  }
  return res.json()
}