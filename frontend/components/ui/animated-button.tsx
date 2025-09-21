"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  ripple?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, loading, ripple, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "transition-all duration-300 transform hover:scale-105 active:scale-95",
          ripple && "relative overflow-hidden",
          loading && "pointer-events-none opacity-70",
          className,
        )}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </div>
        ) : (
          children
        )}
      </Button>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"
