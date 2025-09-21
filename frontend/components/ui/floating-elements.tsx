"use client"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating geometric shapes */}
      <div className="floating-shape floating-shape-1" />
      <div className="floating-shape floating-shape-2" />
      <div className="floating-shape floating-shape-3" />

      {/* Additional floating elements */}
      <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-float" />
      <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30 animate-float-delayed" />
      <div
        className="absolute top-1/2 left-1/4 w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-15 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full opacity-25 animate-float-delayed"
        style={{ animationDelay: "4s" }}
      />
    </div>
  )
}
