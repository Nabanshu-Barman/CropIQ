// Global CSS (must be imported here in App Router)
import "leaflet/dist/leaflet.css"      // Leaflet styles (only if you use react-leaflet/leaflet)
import "../styles/map.css"             // Your custom map sizing/fixes
import "./globals.css"

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "CropIQ - Predict. Prevent. Profit.",
  description: "AI-powered agricultural intelligence platform for crop disease detection and yield prediction",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}