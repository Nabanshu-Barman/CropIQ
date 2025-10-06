"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Users, AlertTriangle, TrendingUp, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CROPS, DISEASES_BY_CROP, parseModelLabel } from "./diseaseCatalog"
import { getDistrictStats, submitReport } from "@/services/communityService"
import { TNDistrictPoints, DistrictPoint } from "./tn-districts"

const pretty = (s: string) => (s || "").replace(/_/g, " ")

interface CommunityMapProps {
  disease: any
  location?: any
  onBack: () => void
}

type StatMap = Record<string, number>

export function CommunityMap({ disease, onBack }: CommunityMapProps) {
  const parsed = useMemo(() => parseModelLabel(disease), [disease])
  const [selectedCrop, setSelectedCrop] = useState<string>(parsed.cropId || "")
  const [selectedDisease, setSelectedDisease] = useState<string>(parsed.diseaseId || "")

  const [stats, setStats] = useState<StatMap>({})
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [showNotification, setShowNotification] = useState(false)

  const userDistrict = typeof window !== "undefined" ? localStorage.getItem("userDistrict") || "" : ""

  const imgRef = useRef<HTMLImageElement | null>(null)
  const [natural, setNatural] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    setNatural({ w: target.naturalWidth, h: target.naturalHeight })
  }

  const toPercent = useCallback(
    (x: number, y: number) => {
      if (!natural.w || !natural.h) return { leftPct: 0, topPct: 0 }
      return { leftPct: (x / natural.w) * 100, topPct: (y / natural.h) * 100 }
    },
    [natural.w, natural.h]
  )

  useEffect(() => {
    let ignore = false
    async function fetchStats() {
      setError("")
      setShowNotification(false)
      setStats({})
      setTotal(0)
      if (!selectedCrop || !selectedDisease) return
      setLoading(true)
      try {
        const { stats, total } = await getDistrictStats(selectedCrop, selectedDisease)
        if (ignore) return
        const m: StatMap = {}
        stats.forEach((s) => (m[s.district] = s.count))
        setStats(m)
        setTotal(total)
        const my = userDistrict ? m[userDistrict] ?? 0 : 0
        if (my >= 10) {
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 5000)
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load stats")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchStats()
    return () => {
      ignore = true
    }
  }, [selectedCrop, selectedDisease, userDistrict])

  const districtStatsList = useMemo(
    () =>
      TNDistrictPoints
        .map((d) => ({ district: d.name, count: stats[d.name] ?? 0 }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count),
    [stats]
  )

  const getIntensityColor = (reports: number) => {
    if (reports >= 10) return "bg-red-500"
    if (reports >= 5) return "bg-orange-500"
    if (reports >= 1) return "bg-yellow-500"
    return "bg-green-500"
  }
  const getIntensityBadgeColor = (reports: number) => {
    if (reports >= 10) return "bg-red-100 text-red-800"
    if (reports >= 5) return "bg-orange-100 text-orange-800"
    if (reports >= 1) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }
  const getIntensityLabel = (reports: number) => {
    if (reports >= 10) return "High Activity"
    if (reports >= 5) return "Moderate Activity"
    if (reports >= 1) return "Low Activity"
    return "Minimal Activity"
  }

  const logThisCase = async () => {
    if (!userDistrict) {
      alert("Please set your district first.")
      return
    }
    if (!selectedCrop || !selectedDisease) {
      alert("Please select crop and disease first.")
      return
    }
    try {
      await submitReport({ district: userDistrict, crop: selectedCrop, disease: selectedDisease })
      const { stats, total } = await getDistrictStats(selectedCrop, selectedDisease)
      const m: StatMap = {}
      stats.forEach((s) => (m[s.district] = s.count))
      setStats(m)
      setTotal(total)
    } catch (e: any) {
      alert(e?.message || "Failed to submit")
    }
  }

  const diseaseOptions = selectedCrop ? DISEASES_BY_CROP[selectedCrop] || [] : []
  const selectedDiseaseLabel = pretty(selectedDisease)

  const HeatDot = ({ pt, count }: { pt: DistrictPoint; count: number }) => {
    const { leftPct, topPct } = toPercent(pt.x, pt.y)
    const anchor = pt.anchor ?? "center"
    const translateClasses = anchor === "topleft" ? "" : " -translate-x-1/2 -translate-y-1/2"
    return (
      <div className={`absolute transform${translateClasses}`} style={{ left: `${leftPct}%`, top: `${topPct}%` }}>
        <div className="relative group cursor-pointer">
          <div className={`w-16 h-16 rounded-full ${getIntensityColor(count)} opacity-30 animate-pulse`} />
          <div className={`absolute inset-2 w-12 h-12 rounded-full ${getIntensityColor(count)} opacity-50`} />
          <div className={`absolute inset-4 w-8 h-8 rounded-full ${getIntensityColor(count)} opacity-70`} />
          <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 border-2 border-gray-200">
            {count}
          </div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-amber-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            <div className="font-medium">{pt.name}</div>
            <div>{count} reports • {selectedDiseaseLabel && selectedCrop ? `${selectedDiseaseLabel} (${selectedCrop})` : ""}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-amber-900" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen p-6">
      {showNotification && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Disease Outbreak Alert</h4>
              <p className="text-sm text-red-700">
                High concentration of {selectedDiseaseLabel && selectedCrop ? `${selectedDiseaseLabel} in ${selectedCrop}` : "selected disease"} detected in your district. Take preventive measures immediately.
              </p>
            </div>
            <Button onClick={() => setShowNotification(false)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Header + Log button moved to top-right */}
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Community Disease Map</h2>
            <p className="text-amber-700">Tamil Nadu districts, aggregated by crop and disease</p>
          </div>
        </div>
        <Button onClick={logThisCase} variant="secondary" className="bg-amber-100 hover:bg-amber-200">
          Log this case in my district
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <MapPin className="w-5 h-5 text-amber-600" />
                Tamil Nadu Disease Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-auto rounded-lg border border-blue-200">
                <img
                  ref={imgRef}
                  src="/images/heatmap.jpg"
                  alt="Tamil Nadu Disease Heatmap"
                  className="block max-w-full h-auto object-contain opacity-90"
                  onLoad={onImgLoad}
                />

                {natural.w > 0 &&
                  TNDistrictPoints.map((pt) => {
                    const count = stats[pt.name] ?? 0
                    if (count <= 0) return null
                    return <HeatDot key={pt.id} pt={pt} count={count} />
                  })}

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-amber-200">
                  <h4 className="text-sm font-medium text-amber-900 mb-2">Activity Levels</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-red-500 rounded-full" /><span className="text-amber-800">High (10+)</span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-orange-500 rounded-full" /><span className="text-amber-800">Moderate (5-9)</span></div>
                    <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 bg-yellow-500 rounded-full" /><span className="text-amber-800">Low (1-4)</span></div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-amber-900">LIVE</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-amber-800">
                {loading ? "Loading..." : error ? <span className="text-red-600">{error}</span> : <>Total cases: <b>{total}</b></>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Stats */}
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-amber-800 mb-2 block">Crop</label>
                <Select value={selectedCrop} onValueChange={(v) => { setSelectedCrop(v); setSelectedDisease(""); }}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROPS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-amber-800 mb-2 block">Disease</label>
                <Select value={selectedDisease} onValueChange={setSelectedDisease} disabled={!selectedCrop}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder={selectedCrop ? "Select disease" : "Select crop first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(DISEASES_BY_CROP[selectedCrop] || []).map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-700">{districtStatsList.length}</div>
                <div className="text-xs text-amber-600">Districts With Reports</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{total}</div>
                <div className="text-xs text-green-600">Total Cases</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Users className="w-5 h-5 text-amber-600" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {districtStatsList.map((item) => (
                  <div key={item.district} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-amber-900">{item.district}</h4>
                      <Badge className={`text-xs ${getIntensityBadgeColor(item.count)}`}>{getIntensityLabel(item.count)}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-amber-600">
                      <span>{item.count} reports</span>
                      <span>today</span>
                    </div>
                  </div>
                ))}
                {districtStatsList.length === 0 && (
                  <div className="text-sm text-amber-700">No reports yet. Log one to get started.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}