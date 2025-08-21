"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface DiseaseAnalysis {
  image: string
  diagnosis: string
  confidence: number
  recommendations: string
  timestamp: string
}

export function DiseaseDetector() {
  const [timeUntilNext, setTimeUntilNext] = useState(86400) // 24 hours in seconds
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState<DiseaseAnalysis | null>(null)
	// eslint-disable-next-line
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilNext((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target?.result as string
      setUploadedImage(imageData)
      await analyzeImage(imageData)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true)

    try {
      // TODO: Replace with actual OpenAI API call
      // const response = await fetch('/api/analyze-plant', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ image: imageData })
      // })
      // const result = await response.json()

      // Simulated analysis for demo
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockAnalysis: DiseaseAnalysis = {
        image: imageData,
        diagnosis: "Healthy Plant",
        confidence: 92,
        recommendations: `## Plant Health Assessment

**Status:** Your chilli plant appears to be in excellent health! 

### Observations:
- **Leaf Color:** Vibrant green coloration indicates proper chlorophyll production
- **Leaf Structure:** No signs of wilting, browning, or unusual spotting
- **Growth Pattern:** Normal leaf development and spacing

### Recommendations:
1. **Continue Current Care:** Your current watering and nutrient schedule appears optimal
2. **Monitor Growth:** Keep tracking sensor readings to maintain these ideal conditions
3. **Preventive Care:** Consider light pruning of lower leaves to improve air circulation
4. **Nutrition:** Current NPK levels are supporting healthy growth

### Next Steps:
- Continue monitoring with your IoT sensors
- Take another photo in 24 hours for comparison
- Watch for any changes in leaf color or texture

**Confidence Level:** 92% - High confidence in healthy plant assessment`,
        timestamp: new Date().toLocaleString(),
      }

      setLastAnalysis(mockAnalysis)
    } catch (error) {
      console.error("Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Timer and Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Automatic Scan
            </CardTitle>
            <CardDescription>IoT device captures images every 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-bold text-center py-4">{formatTime(timeUntilNext)}</div>
            <p className="text-sm text-muted-foreground text-center">
              Time remaining until next automatic image capture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Manual Upload
            </CardTitle>
            <CardDescription>Upload an image for immediate analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload">
                <Button asChild className="w-full cursor-pointer">
                  <span>
                    <Camera className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Upload Image"}
                  </span>
                </Button>
              </label>
              {isAnalyzing && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Analyzing with AI...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {lastAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Display */}
          <Card>
            <CardHeader>
              <CardTitle>Analyzed Image</CardTitle>
              <CardDescription>Captured on {lastAnalysis.timestamp}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <img
                  src={lastAnalysis.image || "/placeholder.svg"}
                  alt="Plant analysis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {lastAnalysis.diagnosis.toLowerCase().includes("healthy") ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium">{lastAnalysis.diagnosis}</span>
                </div>
                <Badge variant={lastAnalysis.confidence > 80 ? "secondary" : "outline"}>
                  {lastAnalysis.confidence}% confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Description */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Report</CardTitle>
              <CardDescription>Detailed diagnosis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{lastAnalysis.recommendations}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Instructions */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Integration Setup</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">To enable AI disease detection, add these environment variables:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <code>OPENAI_API_KEY</code> - Your OpenAI API key
            </li>
            <li>
              <code>FIREBASE_CONFIG</code> - Firebase configuration for image storage
            </li>
          </ul>
          <p className="mt-2">The system will automatically process images from your IoT device every 24 hours.</p>
        </CardContent>
      </Card>
    </div>
  )
}
