"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Thermometer, Droplets, Leaf, Sun, Gauge, Pencil, Check, X } from "lucide-react"

interface SensorData {
  temperature: number
  humidity: number
  soilMoisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
  infrared: number
  lastUpdated: string
}

interface OptimalRanges {
  temperature: { min: number; max: number }
  humidity: { min: number; max: number }
  soilMoisture: { min: number; max: number }
  nitrogen: { min: number; max: number }
  phosphorus: { min: number; max: number }
  potassium: { min: number; max: number }
  infrared: { min: number; max: number }
}

export function SensorReadings() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 25.4,
    humidity: 68,
    soilMoisture: 45,
    nitrogen: 120,
    phosphorus: 85,
    potassium: 95,
    infrared: 750,
    lastUpdated: new Date().toLocaleTimeString(),
  })

  const [optimalRanges, setOptimalRanges] = useState<OptimalRanges>({
    temperature: { min: 20, max: 30 },
    humidity: { min: 60, max: 70 },
    soilMoisture: { min: 40, max: 60 },
    nitrogen: { min: 100, max: 150 },
    phosphorus: { min: 80, max: 120 },
    potassium: { min: 90, max: 130 },
    infrared: { min: 600, max: 900 },
  })

  const [editingOptimal, setEditingOptimal] = useState<string | null>(null)
  const [tempOptimalValues, setTempOptimalValues] = useState({ min: 0, max: 0 })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prev) => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
        soilMoisture: Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        nitrogen: Math.max(0, prev.nitrogen + (Math.random() - 0.5) * 10),
        phosphorus: Math.max(0, prev.phosphorus + (Math.random() - 0.5) * 8),
        potassium: Math.max(0, prev.potassium + (Math.random() - 0.5) * 12),
        infrared: Math.max(0, prev.infrared + (Math.random() - 0.5) * 50),
        lastUpdated: new Date().toLocaleTimeString(),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (value: number, min: number, max: number) => {
    if (value < min || value > max) {
      return <Badge variant="destructive">Alert</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
  }

  const startEditingOptimal = (sensor: string, min: number, max: number) => {
    setEditingOptimal(sensor)
    setTempOptimalValues({ min, max })
  }

  const saveOptimalRange = (sensor: string) => {
    setOptimalRanges((prev) => ({
      ...prev,
      [sensor]: { min: tempOptimalValues.min, max: tempOptimalValues.max },
    }))
    setEditingOptimal(null)
  }

  const cancelEditingOptimal = () => {
    setEditingOptimal(null)
    setTempOptimalValues({ min: 0, max: 0 })
  }

  const renderOptimalRange = (sensor: string, unit = "") => {
    const range = optimalRanges[sensor as keyof OptimalRanges]
    const isEditing = editingOptimal === sensor

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={tempOptimalValues.min}
            onChange={(e) => setTempOptimalValues((prev) => ({ ...prev, min: Number(e.target.value) }))}
            className="w-12 h-6 text-xs p-1"
          />
          <span className="text-xs">-</span>
          <Input
            type="number"
            value={tempOptimalValues.max}
            onChange={(e) => setTempOptimalValues((prev) => ({ ...prev, max: Number(e.target.value) }))}
            className="w-12 h-6 text-xs p-1"
          />
          <span className="text-xs">{unit}</span>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => saveOptimalRange(sensor)}>
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEditingOptimal}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">
          Optimal: {range.min}-{range.max}
          {unit}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-4 w-4 p-0"
          onClick={() => startEditingOptimal(sensor, range.min, range.max)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">Last updated: {sensorData.lastUpdated}</div>

      {/* Environmental Sensors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData.temperature.toFixed(1)}°C</div>
            <div className="flex items-center justify-between mt-2">
              {renderOptimalRange("temperature", "°C")}
              {getStatusBadge(sensorData.temperature, optimalRanges.temperature.min, optimalRanges.temperature.max)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData.humidity.toFixed(0)}%</div>
            <div className="flex items-center justify-between mt-2">
              {renderOptimalRange("humidity", "%")}
              {getStatusBadge(sensorData.humidity, optimalRanges.humidity.min, optimalRanges.humidity.max)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData.soilMoisture.toFixed(0)}%</div>
            <div className="flex items-center justify-between mt-2">
              {renderOptimalRange("soilMoisture", "%")}
              {getStatusBadge(sensorData.soilMoisture, optimalRanges.soilMoisture.min, optimalRanges.soilMoisture.max)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrared</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData.infrared.toFixed(0)}</div>
            <div className="flex items-center justify-between mt-2">
              {renderOptimalRange("infrared")}
              {getStatusBadge(sensorData.infrared, optimalRanges.infrared.min, optimalRanges.infrared.max)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPK Sensor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-muted-foreground" />
            NPK Soil Nutrients
          </CardTitle>
          <CardDescription>Nitrogen, Phosphorus, and Potassium levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.nitrogen.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Nitrogen (N)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                {renderOptimalRange("nitrogen")}
                {getStatusBadge(sensorData.nitrogen, optimalRanges.nitrogen.min, optimalRanges.nitrogen.max)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.phosphorus.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Phosphorus (P)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                {renderOptimalRange("phosphorus")}
                {getStatusBadge(sensorData.phosphorus, optimalRanges.phosphorus.min, optimalRanges.phosphorus.max)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.potassium.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Potassium (K)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                {renderOptimalRange("potassium")}
                {getStatusBadge(sensorData.potassium, optimalRanges.potassium.min, optimalRanges.potassium.max)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
