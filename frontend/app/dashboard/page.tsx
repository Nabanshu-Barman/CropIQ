"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dashboard as DashboardComponent } from "@/components/dashboard/dashboard"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const u = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (!u) {
      router.replace("/login")
      return
    }
    const l = typeof window !== "undefined" ? localStorage.getItem("location") : null
    if (!l) {
      router.replace("/location")
      return
    }
    try {
      setUser(JSON.parse(u))
      setLocation(JSON.parse(l))
    } catch {
      router.replace("/login")
      return
    }
    setReady(true)
  }, [router])

  if (!ready) return null

  return <DashboardComponent user={user} location={location} />
}