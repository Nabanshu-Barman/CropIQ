const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export type ReportRequest = {
  district: string
  crop: string
  disease: string
}

export type DistrictStat = { district: string; count: number }

export async function getDistrictStats(crop: string, disease: string): Promise<{ stats: DistrictStat[]; total: number }> {
  const url = new URL(`${API_BASE}/api/community/stats`)
  url.searchParams.set("crop", crop)
  url.searchParams.set("disease", disease)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`)
  return res.json()
}

export async function submitReport(payload: ReportRequest): Promise<{ ok: boolean; count: number }> {
  const res = await fetch(`${API_BASE}/api/community/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to submit report: ${res.status}`)
  return res.json()
}

export async function getDistricts(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/community/districts`)
  if (!res.ok) throw new Error(`Failed to fetch districts: ${res.status}`)
  return res.json()
}