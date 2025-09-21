"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MapPin, Navigation, CheckCircle } from "lucide-react"

interface LocationSetupProps {
  onLocationSet: (locationData: any) => void
}

export function LocationSetup({ onLocationSet }: LocationSetupProps) {
  const [step, setStep] = useState<"permission" | "detecting" | "confirm">("permission")
  const [location, setLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRequestPermission = async () => {
    setIsLoading(true)
    setStep("detecting")

    // Simulate location detection
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock location data
    const mockLocation = {
      state: "Maharashtra",
      district: "Pune",
      coordinates: { lat: 18.5204, lng: 73.8567 },
      weather: {
        temperature: 28,
        humidity: 65,
        condition: "Partly Cloudy",
      },
    }

    setLocation(mockLocation)
    setStep("confirm")
    setIsLoading(false)
  }

  const handleConfirmLocation = () => {
    onLocationSet(location)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "permission" && (
          <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-emerald-600 animate-bounce" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Location Access</CardTitle>
              <CardDescription className="text-gray-600">
                We need your location to provide accurate crop recommendations and local weather data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-gray-700">Personalized crop recommendations</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">Real-time weather updates</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-gray-700">Local disease outbreak alerts</span>
                </div>
              </div>

              <AnimatedButton
                onClick={handleRequestPermission}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 text-lg"
                ripple
              >
                <Navigation className="w-5 h-5 mr-2" />
                Allow Location Access
              </AnimatedButton>

              <p className="text-xs text-gray-500 text-center">
                Your location data is encrypted and never shared with third parties
              </p>
            </CardContent>
          </Card>
        )}

        {step === "detecting" && (
          <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Detecting Your Location</h3>
                  <p className="text-gray-600">Please wait while we find your exact location...</p>
                </div>
                <LoadingSpinner size="lg" text="Getting GPS coordinates..." />
              </div>
            </CardContent>
          </Card>
        )}

        {step === "confirm" && location && (
          <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-900">Location Confirmed</CardTitle>
              <CardDescription className="text-gray-600">
                We've detected your location. Please confirm if this is correct.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">State:</span>
                  <span className="text-sm text-gray-900">{location.state}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">District:</span>
                  <span className="text-sm text-gray-900">{location.district}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Temperature:</span>
                  <span className="text-sm text-gray-900">{location.weather.temperature}°C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Condition:</span>
                  <span className="text-sm text-gray-900">{location.weather.condition}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <AnimatedButton onClick={() => setStep("permission")} variant="outline" className="flex-1">
                  Change Location
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleConfirmLocation}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  ripple
                >
                  Confirm & Continue
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
