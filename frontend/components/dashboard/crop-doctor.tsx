"use client"

import { useState } from "react"
import { ImageUpload } from "./crop-doctor/image-upload"
import { CropSelection } from "./crop-doctor/crop-selection"
import { AnalysisResults } from "./crop-doctor/analysis-results"
import { CommunityMap } from "./crop-doctor/community-map"

type CropDoctorStep = "crop-selection" | "image-upload" | "analysis" | "community"

export function CropDoctor() {
  const [step, setStep] = useState<CropDoctorStep>("crop-selection")
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop)
    setStep("image-upload")
  }

  const handleImageUpload = (file: File) => {
    setUploadedImage(file)
    setStep("analysis")
  }

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result)
  }

  const handleViewCommunity = () => {
    setStep("community")
  }

  return (
    <div className="space-y-6">
      {step === "crop-selection" && <CropSelection onCropSelect={handleCropSelect} />}
      {step === "image-upload" && (
        <ImageUpload
          selectedCrop={selectedCrop}
          onImageUpload={handleImageUpload}
          onBack={() => setStep("crop-selection")}
        />
      )}
      {step === "analysis" && (
        <AnalysisResults
          image={uploadedImage}
          crop={selectedCrop}
          onAnalysisComplete={handleAnalysisComplete}
          onViewCommunity={handleViewCommunity}
          onBack={() => setStep("image-upload")}
        />
      )}
      {step === "community" && (
        <CommunityMap
          disease={analysisResult?.disease}
          location={analysisResult?.location}
          onBack={() => setStep("analysis")}
        />
      )}
    </div>
  )
}
