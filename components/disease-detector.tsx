"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface SensorReadings {
  temperature: number
  humidity: number
  soilMoisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
  infrared: number
  phLevel?: number
}

interface DiseaseAnalysis {
  image: string
  diagnosis: string
  confidence: number
  recommendations: string
  timestamp: string
  status: 'healthy' | 'diseased'
  issue?: string
}

interface DiseaseDetectorProps {
  sensorReadings?: SensorReadings
}

export function DiseaseDetector({ sensorReadings }: DiseaseDetectorProps) {
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
      // Create default sensor readings with proper typing
      const defaultSensorData = {
        temperature: sensorReadings?.temperature || 0,
        humidity: sensorReadings?.humidity || 0,
        soilMoisture: sensorReadings?.soilMoisture || 0,
        lightLevel: sensorReadings?.infrared || 0,
        phLevel: sensorReadings?.phLevel || 7,
        nitrogen: sensorReadings?.nitrogen || 0,
        phosphorus: sensorReadings?.phosphorus || 0,
        potassium: sensorReadings?.potassium || 0
      }

      // Call the actual OpenAI API with sensor readings
      const response = await fetch('/api/analyze-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: imageData,
          sensorReadings: defaultSensorData
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      const analysis: DiseaseAnalysis = {
        image: imageData,
        diagnosis: result.diagnosis,
        confidence: result.confidence,
        recommendations: result.recommendations,
        timestamp: new Date().toLocaleString(),
        status: result.status,
        issue: result.issue
      }

      setLastAnalysis(analysis)
    } catch (error) {
      console.error("Error analyzing image:", error)
      // Fallback to mock data if API fails
      const mockAnalysis: DiseaseAnalysis = {
        image: imageData,
        diagnosis: "Analysis Failed - Using Mock Data",
        confidence: 0,
        status: 'healthy',
        recommendations: `## Analysis Error

**Status:** Unable to connect to OpenAI API

### Mock Response:
Your chilli plant appears to be in good condition based on visual inspection.

### Current Sensor Readings:
${sensorReadings ? `
- **Temperature:** ${sensorReadings.temperature.toFixed(1)}°C
- **Humidity:** ${sensorReadings.humidity}%
- **Soil Moisture:** ${sensorReadings.soilMoisture}%
- **Nitrogen:** ${sensorReadings.nitrogen}
- **Phosphorus:** ${sensorReadings.phosphorus}
- **Potassium:** ${sensorReadings.potassium}
- **Infrared:** ${sensorReadings.infrared}
${sensorReadings.phLevel ? `- **pH Level:** ${sensorReadings.phLevel}` : ''}
` : 'No sensor data available'}

### Recommendations:
1. **Check API Configuration:** Ensure OPENAI_API_KEY is properly set
2. **Monitor Sensors:** Continue tracking environmental conditions
3. **Try Again:** Attempt analysis again once API connection is restored`,
        timestamp: new Date().toLocaleString(),
      }

      setLastAnalysis(mockAnalysis)
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
                  {lastAnalysis.status === 'healthy' ? (
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

    </div>
  )
}
