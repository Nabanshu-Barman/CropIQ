"use client"

import Image from "next/image"
import { Cloud, MapPin, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  user: any
  location: any
  onProfileClick?: () => void
}

export function Header({ user, location, onProfileClick }: HeaderProps) {
  const handleProfileClick = () => {
    console.log("[v0] Profile clicked, calling onProfileClick")
    onProfileClick?.()
  }

  return (
    <header className="glass-strong border-b border-border/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 hover-lift">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-30 animate-pulse-glow" />
              <Image
                src="/images/logo.png"
                alt="CropIQ"
                width={48}
                height={48}
                className="relative animate-float hover-glow"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">CropIQ</h1>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Predict. Prevent. Profit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass hover-lift flex items-center gap-2 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {location?.district}, {location?.state}
              </span>
            </div>

            <div className="glass hover-lift flex items-center gap-2 px-3 py-2 rounded-lg">
              <Cloud className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{location?.weather?.temperature}°C</span>
              <span className="text-xs text-muted-foreground">{location?.weather?.condition}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="glass magnetic-btn flex items-center gap-2 px-4 py-2 rounded-lg hover-glow"
                  onClick={() => console.log("[v0] Dropdown trigger clicked")}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{user?.name || "John Farmer"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-strong border-border/20 animate-scale-in">
                <DropdownMenuLabel className="text-foreground font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  className="text-foreground hover:bg-accent/10 focus:bg-accent/10 cursor-pointer hover-lift"
                >
                  <User className="w-4 h-4 mr-2 text-primary" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-accent/10 focus:bg-accent/10 cursor-pointer hover-lift">
                  <Sparkles className="w-4 h-4 mr-2 text-accent" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/20" />
                <DropdownMenuItem className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer hover-lift">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
