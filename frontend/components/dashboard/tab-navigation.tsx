"use client"

import { Search, TrendingUp, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TabType } from "./dashboard"

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  {
    id: "crop-doctor" as TabType,
    label: "Crop Doctor",
    icon: Search,
    description: "AI Disease Detection",
  },
  {
    id: "yield-predictor" as TabType,
    label: "Yield Predictor",
    icon: TrendingUp,
    description: "Real-time Predictions",
    flagship: true,
  },
  {
    id: "manual-predictor" as TabType,
    label: "Manual Predictor",
    icon: Settings,
    description: "Custom Parameters",
  },
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-green-200 p-1">
      <div className="flex relative">
        <div
          className={cn(
            "absolute top-1 bottom-1 bg-green-100 rounded-md transition-all duration-300 ease-in-out",
            activeTab === "crop-doctor" && "left-1 w-[calc(33.33%-4px)]",
            activeTab === "yield-predictor" && "left-[33.33%] w-[calc(33.33%-4px)]",
            activeTab === "manual-predictor" && "left-[66.66%] w-[calc(33.33%-4px)]",
          )}
        />

        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex-1 flex flex-col items-center gap-2 py-4 px-6 rounded-md transition-all duration-200",
                "hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                isActive && "text-green-800",
                !isActive && "text-green-600 hover:text-green-800",
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "text-green-700 scale-110",
                    !isActive && "text-green-600",
                  )}
                />
                <span className={cn("font-medium text-sm", isActive && "text-green-800")}>
                  {tab.label}
                  {tab.flagship && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Flagship</span>
                  )}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs transition-colors duration-200",
                  isActive && "text-green-700",
                  !isActive && "text-green-600",
                )}
              >
                {tab.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
