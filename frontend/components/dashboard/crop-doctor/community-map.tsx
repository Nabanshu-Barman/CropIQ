"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Users, AlertTriangle, TrendingUp, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CommunityMapProps {
  disease: any
  location: any
  onBack: () => void
}

const mockReports = [
  {
    id: 1,
    disease: "Early Blight",
    location: "Chennai District",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    reports: 15,
    lastReported: "2 hours ago",
  },
  {
    id: 2,
    disease: "Late Blight",
    location: "Coimbatore District",
    coordinates: { lat: 17.6868, lng: 74.0183 },
    reports: 8,
    lastReported: "5 hours ago",
  },
  {
    id: 3,
    disease: "Powdery Mildew",
    location: "Madurai District",
    coordinates: { lat: 19.9975, lng: 73.7898 },
    reports: 12,
    lastReported: "1 day ago",
  },
  {
    id: 4,
    disease: "Early Blight",
    location: "Tiruchirappalli District",
    coordinates: { lat: 17.6599, lng: 75.9064 },
    reports: 6,
    lastReported: "3 hours ago",
  },
]

export function CommunityMap({ disease, location, onBack }: CommunityMapProps) {
  const [selectedDisease, setSelectedDisease] = useState<string>("all")
  const [filteredReports, setFilteredReports] = useState(mockReports)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check if there are more than 10 reports for the same disease
    const sameDisease = mockReports.filter((report) => report.disease === disease?.name)
    if (sameDisease.length >= 10) {
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }
  }, [disease])

  useEffect(() => {
    let filtered = mockReports

    if (selectedDisease !== "all") {
      filtered = filtered.filter((report) => report.disease === selectedDisease)
    }

    setFilteredReports(filtered)
  }, [selectedDisease])

  const getIntensityColor = (reports: number) => {
    if (reports >= 12) return "bg-red-500"
    if (reports >= 8) return "bg-orange-500"
    if (reports >= 5) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getIntensityBadgeColor = (reports: number) => {
    if (reports >= 12) return "bg-red-100 text-red-800"
    if (reports >= 8) return "bg-orange-100 text-orange-800"
    if (reports >= 5) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getIntensityLabel = (reports: number) => {
    if (reports >= 12) return "High Activity"
    if (reports >= 8) return "Moderate Activity"
    if (reports >= 5) return "Low Activity"
    return "Minimal Activity"
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen p-6">
      {/* Notification Banner */}
      {showNotification && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Disease Outbreak Alert</h4>
              <p className="text-sm text-red-700">
                High concentration of {disease?.name} detected in your region. Take preventive measures immediately.
              </p>
            </div>
            <Button
              onClick={() => setShowNotification(false)}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
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
          <p className="text-amber-700">Real-time disease reports from farmers in Tamil Nadu</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <div className="lg:col-span-2">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <MapPin className="w-5 h-5 text-amber-600" />
                Maharashtra Disease Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-lg max-h-[90vh] overflow-auto border border-blue-200">
                {/* Map Background - US style with state boundaries */}
                <img
                  src="/images/heatmap.png"
                  alt="Disease Heatmap"
                  className="w-full h-auto opacity-80"
                />

                {/* Disease Heat Zones - overlaid on the map */}
                {filteredReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${25 + (index * 18) + Math.random() * 30}%`,
                      top: `${35 + (index * 12) + Math.random() * 25}%`,
                    }}
                  >
                    <div className="relative group cursor-pointer">
                      {/* Heat zone effect */}
                      <div
                        className={`w-16 h-16 rounded-full ${getIntensityColor(report.reports)} opacity-30 animate-pulse`}
                      />
                      <div
                        className={`absolute inset-2 w-12 h-12 rounded-full ${getIntensityColor(report.reports)} opacity-50`}
                      />
                      <div
                        className={`absolute inset-4 w-8 h-8 rounded-full ${getIntensityColor(report.reports)} opacity-70`}
                      />

                      {/* Report count indicator */}
                      <div className="absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 border-2 border-gray-200">
                        {report.reports}
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-amber-900 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div className="font-medium">{report.disease}</div>
                        <div>{report.location}</div>
                        <div>
                          {report.reports} reports • {report.lastReported}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-amber-900" />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-65 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-amber-200">
                  <h4 className="text-sm font-medium text-amber-900 mb-2">Activity Levels</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-amber-800">High Activity (12+ reports)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-orange-500 rounded-full" />
                      <span className="text-amber-800">Moderate Activity (8-11 reports)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-amber-800">Low Activity (5-7 reports)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-amber-800">Minimal Activity (1-4 reports)</span>
                    </div>
                  </div>
                </div>

                {/* Live Indicator */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-amber-900">LIVE</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Reports */}
        <div className="space-y-6">
          {/* Filters */}
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-amber-800 mb-2 block">Disease Type</label>
                <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="All diseases" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Diseases</SelectItem>
                    <SelectItem value="Early Blight">Early Blight</SelectItem>
                    <SelectItem value="Late Blight">Late Blight</SelectItem>
                    <SelectItem value="Powdery Mildew">Powdery Mildew</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">{filteredReports.length}</div>
                  <div className="text-xs text-amber-600">Active Reports</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">
                    {filteredReports.reduce((sum, report) => sum + report.reports, 0)}
                  </div>
                  <div className="text-xs text-green-600">Total Cases</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Users className="w-5 h-5 text-amber-600" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-amber-900">{report.disease}</h4>
                      <Badge className={`text-xs ${getIntensityBadgeColor(report.reports)}`}>
                        {getIntensityLabel(report.reports)}
                      </Badge>
                    </div>
                    <p className="text-xs text-amber-700 mb-1">{report.location}</p>
                    <div className="flex items-center justify-between text-xs text-amber-600">
                      <span>{report.reports} reports</span>
                      <span>{report.lastReported}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
