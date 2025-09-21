"use client"

import { useState } from "react"
import { Header } from "./header"
import { TabNavigation } from "./tab-navigation"
import { CropDoctor } from "./crop-doctor"
import { YieldPredictor } from "./yield-predictor"
import { ManualPredictor } from "./manual-predictor"
import { Profile } from "./profile"

interface DashboardProps {
  user: any
  location: any
}

export type TabType = "crop-doctor" | "yield-predictor" | "manual-predictor"

export function Dashboard({ user, location }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("crop-doctor")
  const [showProfile, setShowProfile] = useState(false)

  const handleProfileClick = () => {
    setShowProfile(true)
  }

  const handleBackToDashboard = () => {
    setShowProfile(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="floating-leaf floating-leaf-1" />
        <div className="floating-leaf floating-leaf-2" />
        <div className="floating-leaf floating-leaf-3" />
      </div>

      <Header user={user} location={location} onProfileClick={handleProfileClick} />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {showProfile ? (
          <div className="animate-scale-in">
            <Profile user={user} location={location} onBack={handleBackToDashboard} />
          </div>
        ) : (
          <>
            <div className="animate-slide-up">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="mt-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              {activeTab === "crop-doctor" && <CropDoctor />}
              {activeTab === "yield-predictor" && <YieldPredictor />}
              {activeTab === "manual-predictor" && <ManualPredictor />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
