"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, ArrowLeft, Scan } from "lucide-react"

interface ProfileProps {
  user: any
  location: any
  onBack: () => void
}

export function Profile({ user, location, onBack }: ProfileProps) {
  const scannedDiseases = ["Early Blight", "Late Blight", "Bacterial Spot", "Powdery Mildew", "Leaf Curl"]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-green-900">My Profile</h2>
          <p className="text-green-700">Your account information</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <User className="w-5 h-5 text-green-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/farmer-portrait.png" />
                <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                  {user?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "JF"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-900">{user?.name || "John Farmer"}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Email</p>
                    <p className="text-green-900">{user?.email || "john.farmer@example.com"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Location</p>
                      <p className="text-green-900">
                        {location?.district}, {location?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Scan className="w-5 h-5 text-green-600" />
              Farming Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-green-600 font-medium mb-3">Diseases Scanned</p>
              <div className="flex flex-wrap gap-2">
                {scannedDiseases.map((disease, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                    {disease}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
