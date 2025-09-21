"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { LocationSetup } from "@/components/auth/location-setup"
import { Dashboard } from "@/components/dashboard/dashboard"
import { ParticleSystem } from "@/components/ui/particle-system"
import { FloatingElements } from "@/components/ui/floating-elements"

type AppState = "login" | "location" | "dashboard"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("login")
  const [user, setUser] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setAppState("location")
  }

  const handleLocationSetup = (locationData: any) => {
    setLocation(locationData)
    setAppState("dashboard")
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ParticleSystem />
      <FloatingElements />

      <div className="relative z-10">
        {appState === "login" && <LoginForm onLogin={handleLogin} />}
        {appState === "location" && <LocationSetup onLocationSet={handleLocationSetup} />}
        {appState === "dashboard" && <Dashboard user={user} location={location} />}
      </div>
    </main>
  )
}
