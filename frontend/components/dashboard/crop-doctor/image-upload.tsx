"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Upload, X, ArrowLeft, Camera, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  selectedCrop: string | null
  onImageUpload: (file: File) => void
  onBack: () => void
}

export function ImageUpload({ selectedCrop, onImageUpload, onBack }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    console.log("No file selected");
    return;
  }
  try {
    console.log("Uploading file...");
    const result = await predictPlantDisease(file);
    console.log("Prediction result:", result);
    setPrediction(result); // or however you store/display the result
  } catch (err) {
    console.error("Prediction error:", err);
    setError("Prediction failed!"); // show to user
  }
};

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleAnalyze = () => {
    if (selectedFile) {
      onImageUpload(selectedFile)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload {selectedCrop} Image</h2>
          <p className="text-gray-600">Take or upload a clear photo of your crop for AI analysis</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Image Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50 animate-shimmer"
                    : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {dragActive ? "Drop your image here" : "Upload crop image"}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">Drag and drop or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <AnimatedButton asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <span>Choose File</span>
                      </AnimatedButton>
                    </label>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      JPG
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      PNG
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      WEBP
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewUrl! || "/placeholder.svg"}
                    alt="Preview"
                    className="mx-auto w-[70%] max-h-[300px] object-contain rounded-lg animate-in fade-in duration-500"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips and Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Photography Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Good Lighting</p>
                  <p className="text-xs text-gray-600">Take photos in natural daylight for best results</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Clear Focus</p>
                  <p className="text-xs text-gray-600">Ensure the affected area is in sharp focus</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Close-up View</p>
                  <p className="text-xs text-gray-600">Capture detailed view of leaves or affected parts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Multiple Angles</p>
                  <p className="text-xs text-gray-600">Take photos from different angles if possible</p>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="pt-4 border-t">
                <AnimatedButton
                  onClick={handleAnalyze}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  ripple
                >
                  Analyze with AI
                </AnimatedButton>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
