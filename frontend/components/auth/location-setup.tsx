"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, CheckCircle } from "lucide-react"
import { TNDistrictNames } from "@/components/dashboard/crop-doctor/tn-districts"

interface LocationSetupProps {
  onLocationSet: (locationData: any) => void
}

export function LocationSetup({ onLocationSet }: LocationSetupProps) {
  const [district, setDistrict] = useState<string>("")

  // Load any previously saved district
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("userDistrict") : null
    if (saved) setDistrict(saved)
  }, [])

  const handleConfirmLocation = () => {
    if (!district) return
    // Persist for later use (CommunityMap reads this)
    localStorage.setItem("userDistrict", district)

    // Pass a consistent payload to the caller
    onLocationSet({
      state: "Tamil Nadu",
      district,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">Set Your Location</CardTitle>
            <CardDescription className="text-gray-600">
              Manual selection only. Choose your Tamil Nadu district to enable local insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">District</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your district" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {TNDistrictNames.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Your selection is saved to your device and used for outbreak alerts.
            </div>

            <AnimatedButton
              onClick={handleConfirmLocation}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 text-lg"
              ripple
              disabled={!district}
            >
              Confirm & Continue
            </AnimatedButton>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}