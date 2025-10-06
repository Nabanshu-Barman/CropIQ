"use client"

export function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ${className}`}>
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      LIVE
    </div>
  )
}