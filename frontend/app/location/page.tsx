"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LocationSetup } from "@/components/auth/location-setup"
import { ParticleSystem } from "@/components/ui/particle-system"

export default function LocationPage() {
  const router = useRouter()

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (!user) router.replace("/login")
  }, [router])

  return (
    <>
      <ParticleSystem />
      <LocationSetup
        onLocationSet={(locationData: any) => {
          try {
            localStorage.setItem("location", JSON.stringify(locationData))
          } catch {}
          router.push("/dashboard")
        }}
      />
    </>
  )
}