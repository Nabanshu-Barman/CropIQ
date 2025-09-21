"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CropSelectionProps {
  onCropSelect: (crop: string) => void
}

const crops = [
  {
    id: "apple",
    name: "Apple",
    image: "/apple.jpg",
    description: "Popular tree fruit",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    image: "/blueberry-bush-with-ripe-berries.jpg",
    description: "Antioxidant-rich berries",
  },
  {
    id: "cherry",
    name: "Cherry",
    image: "/cherry.jpg",
    description: "Sweet stone fruit",
  },
  {
    id: "corn",
    name: "Corn",
    image: "/corn-plant-with-golden-ears.jpg",
    description: "Cereal grain crop",
  },
  {
    id: "grape",
    name: "Grape",
    image: "/grape.jpeg",
    description: "Wine and table fruit",
  },
  {
    id: "orange",
    name: "Orange",
    image: "/orange.jpg",
    description: "Citrus fruit rich in vitamin C",
  },
  {
    id: "peach",
    name: "Peach",
    image: "/peach.jpg",
    description: "Soft stone fruit",
  },
  {
    id: "pepper-bell",
    name: "Pepper Bell",
    image: "/bell pepper.jpg",
    description: "Sweet bell pepper",
  },
  {
    id: "potato",
    name: "Potato",
    image: "/potato-plant-with-tubers.jpg",
    description: "Staple root vegetable",
  },
  {
    id: "raspberry",
    name: "Raspberry",
    image: "/raspberry.jpg",
    description: "Tart red berries",
  },
  {
    id: "soybean",
    name: "Soybean",
    image: "/soybean.jpg",
    description: "Protein-rich legume",
  },
  {
    id: "squash",
    name: "Squash",
    image: "/squash.jpg",
    description: "Versatile gourd vegetable",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    image: "/fresh-strawberry-plant-with-berries.jpg",
    description: "Sweet berry crop",
  },
  {
    id: "tomato",
    name: "Tomato",
    image: "/tomato-plant-with-red-tomatoes.jpg",
    description: "Versatile fruit vegetable",
  },
]

export function CropSelection({ onCropSelect }: CropSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)

  const filteredCrops = crops.filter((crop) => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCropClick = (cropId: string) => {
    setSelectedCrop(cropId)
  }

  const handleContinue = () => {
    if (selectedCrop) {
      onCropSelect(selectedCrop)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Crop</h2>
        <p className="text-gray-600">Choose the crop you want to analyze for diseases</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search crops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Crop Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => (
          <Card
            key={crop.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedCrop === crop.id ? "ring-2 ring-emerald-500 bg-emerald-50 shadow-lg scale-105" : "hover:shadow-md"
            }`}
            onClick={() => handleCropClick(crop.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="mb-3">
                <img
                  src={crop.image || "/placeholder.svg"}
                  alt={crop.name}
                  className="w-20 h-20 mx-auto rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{crop.name}</h3>
              <p className="text-xs text-gray-600">{crop.description}</p>
              {selectedCrop === crop.id && (
                <div className="mt-2 flex justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      {selectedCrop && (
        <div className="flex justify-center animate-in fade-in duration-300">
          <AnimatedButton
            onClick={handleContinue}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            ripple
          >
            Continue with {crops.find((c) => c.id === selectedCrop)?.name}
          </AnimatedButton>
        </div>
      )}
    </div>
  )
}
