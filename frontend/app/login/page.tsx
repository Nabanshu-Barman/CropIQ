"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { ParticleSystem } from "@/components/ui/particle-system"

export default function LoginPage() {
  const router = useRouter()

  return (
    <>
      <ParticleSystem />
      <LoginForm
        onLogin={(userData) => {
          try {
            localStorage.setItem("user", JSON.stringify(userData))
          } catch {}
          router.push("/location")
        }}
      />
    </>
  )
}