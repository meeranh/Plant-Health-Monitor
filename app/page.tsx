"use client"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Leaf } from "lucide-react"
import { SensorReadings } from "@/components/sensor-readings"
import { ThresholdControls } from "@/components/threshold-controls"
import { DiseaseDetector } from "@/components/disease-detector"

interface SensorData {
  temperature: number
  humidity: number
  soilMoisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
  infrared: number
  phLevel?: number
}

export default function ChilliMonitoringDashboard() {
  const [currentSensorReadings, setCurrentSensorReadings] = useState<SensorData>({
    temperature: 25.4,
    humidity: 68,
    soilMoisture: 45,
    nitrogen: 120,
    phosphorus: 85,
    potassium: 95,
    infrared: 750,
    phLevel: 6.8,
  })

  // Simulate real-time data updates (same as in sensor-readings component)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSensorReadings((prev) => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
        soilMoisture: Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        nitrogen: Math.max(0, prev.nitrogen + (Math.random() - 0.5) * 10),
        phosphorus: Math.max(0, prev.phosphorus + (Math.random() - 0.5) * 8),
        potassium: Math.max(0, prev.potassium + (Math.random() - 0.5) * 12),
        infrared: Math.max(0, prev.infrared + (Math.random() - 0.5) * 50),
        phLevel: Math.max(4, Math.min(9, prev.phLevel! + (Math.random() - 0.5) * 0.2)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Chilli Plant Monitor</h1>
                <p className="text-sm text-muted-foreground">Real-time IoT monitoring and AI disease detection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Top Section - Sensor Readings */}
          <div>
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-lg border-l-4 border-primary mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Live Sensor Data</h2>
              </div>
              <p className="text-muted-foreground mt-1 ml-5">Real-time monitoring of environmental conditions</p>
            </div>
            <SensorReadings />
          </div>

          <Separator className="my-8" />

          {/* Middle Section - Threshold Controls */}
          <div>
            <div className="bg-gradient-to-r from-secondary/10 to-transparent p-4 rounded-lg border-l-4 border-secondary mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Threshold Configuration</h2>
              </div>
              <p className="text-muted-foreground mt-1 ml-5">Configure automated control parameters and intervals</p>
            </div>
            <ThresholdControls />
          </div>

          <Separator className="my-8" />

          {/* Bottom Section - Disease Detection */}
          <div>
            <div className="bg-gradient-to-r from-accent/10 to-transparent p-4 rounded-lg border-l-4 border-accent mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-accent to-accent/60 rounded-full"></div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">AI Plant Disease Detection</h2>
              </div>
              <p className="text-muted-foreground mt-1 ml-5">
                Upload images for automated disease analysis and recommendations
              </p>
            </div>
            <DiseaseDetector sensorReadings={currentSensorReadings} />
          </div>
        </div>
      </div>
    </div>
  )
}
