"use client"

export function ManualPredictor() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">🎛️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Manual Predictor</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Customize parameters like temperature, humidity, rainfall, and soil pH to get personalized crop
          recommendations.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Coming Soon
        </div>
      </div>
    </div>
  )
}
