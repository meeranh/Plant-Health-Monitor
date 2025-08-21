"use client"
import { Separator } from "@/components/ui/separator"
import { Leaf } from "lucide-react"
import { SensorReadings } from "@/components/sensor-readings"
import { ThresholdControls } from "@/components/threshold-controls"
import { DiseaseDetector } from "@/components/disease-detector"

export default function ChilliMonitoringDashboard() {
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
            <DiseaseDetector />
          </div>
        </div>
      </div>
    </div>
  )
}
