"use client"

export function YieldPredictor() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">🚀</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Yield Predictor</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Real-time AI-powered yield predictions based on current weather conditions and soil data. Coming soon!
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          Flagship Feature - Under Development
        </div>
      </div>
    </div>
  )
}
