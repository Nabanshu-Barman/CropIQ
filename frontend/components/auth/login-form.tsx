"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimatedButton } from "@/components/ui/animated-button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    onLogin({
      id: "1",
      username,
      name: username || "Farmer",
    })

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-scale-in">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/20 rounded-2xl blur-xl opacity-40 animate-pulse" />
              <div className="relative rounded-2xl overflow-hidden shadow-lg animate-gentle-sway">
                <Image
                  src="/images/logo.png"
                  alt="CropIQ Logo"
                  width={250}
                  height={250}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <Card className="glass-earth hover-lift animate-scale-in border-0 shadow-2xl" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-gradient-earth mb-2">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                Sign in to access your agricultural intelligence dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className={`transition-all duration-300 font-medium ${
                      focusedField === "username" ? "text-primary text-glow-natural" : "text-foreground"
                    }`}
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className={`glass-natural transition-all duration-300 hover-glow ${
                      focusedField === "username"
                        ? "border-primary ring-2 ring-primary/30 shadow-lg animate-natural-glow"
                        : "border-border"
                    }`}
                    placeholder="e.g., john_farmer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={`transition-all duration-300 font-medium ${
                      focusedField === "password" ? "text-primary text-glow-natural" : "text-foreground"
                    }`}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`glass-natural transition-all duration-300 hover-glow ${
                      focusedField === "password"
                        ? "border-primary ring-2 ring-primary/30 shadow-lg animate-natural-glow"
                        : "border-border"
                    }`}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  className="w-full magnetic-btn bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-4 text-lg rounded-xl"
                  loading={isLoading}
                  ripple
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <LoadingSpinner size="sm" />
                      <span className="loading-dots">
                        Signing you in<span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </div>
                  ) : (
                    "Sign In to CropIQ"
                  )}
                </AnimatedButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}