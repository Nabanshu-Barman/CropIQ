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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful login
    onLogin({
      id: "1",
      email,
      name: "John Farmer",
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
            <div className="relative inline-block animate-gentle-sway">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/20 rounded-full blur-xl opacity-40 animate-natural-glow" />
              <div className="relative bg-gradient-to-br from-amber-50 to-green-50 p-6 animate-organic-morph shadow-lg">
                <Image
                  src="/images/logo.png"
                  alt="CropIQ Logo"
                  width={80}
                  height={80}
                  className="relative mx-auto"
                />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gradient-earth mb-2 text-glow-natural animate-slide-up">CropIQ</h1>
            <p
              className="text-xl text-muted-foreground font-medium animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Predict. Prevent. Profit.
            </p>
          </div>

          <Card
            className="glass-earth hover-lift animate-scale-in border-0 shadow-2xl"
            style={{ animationDelay: "0.4s" }}
          >
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
                    htmlFor="email"
                    className={`transition-all duration-300 font-medium ${
                      focusedField === "email" ? "text-primary text-glow-natural" : "text-foreground"
                    }`}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`glass-natural transition-all duration-300 hover-glow ${
                      focusedField === "email"
                        ? "border-primary ring-2 ring-primary/30 shadow-lg animate-natural-glow"
                        : "border-border"
                    }`}
                    placeholder="farmer@example.com"
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

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button className="text-primary hover:text-accent font-semibold transition-all duration-300 hover-glow">
                    Sign up for free
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <p className="text-muted-foreground mb-6 text-lg">Powered by AI for smarter farming</p>
            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center gap-2 hover-lift">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-natural-glow" />
                <span className="text-sm font-medium text-foreground">Disease Detection</span>
              </div>
              <div className="flex flex-col items-center gap-2 hover-lift" style={{ animationDelay: "0.2s" }}>
                <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-natural-glow" />
                <span className="text-sm font-medium text-foreground">Yield Prediction</span>
              </div>
              <div className="flex flex-col items-center gap-2 hover-lift" style={{ animationDelay: "0.4s" }}>
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-natural-glow" />
                <span className="text-sm font-medium text-foreground">Community Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
