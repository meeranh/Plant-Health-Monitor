"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Leaf, Gauge } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"

interface SensorData {
  temperature: number
  humidity: number
  moisture: number
  N: number
  P: number
  K: number
  lastUpdated: string
}

interface ThresholdSettings {
  humidityMin: number
  humidityMax: number
  moistureMin: number
  moistureMax: number
  temperature: number
  npkRatioN: number
  npkRatioP: number
  npkRatioK: number
}

export function SensorReadings() {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 25.4,
    humidity: 68,
    moisture: 45,
    N: 120,
    P: 85,
    K: 95,
    lastUpdated: new Date().toLocaleTimeString(),
  })

  const [thresholds, setThresholds] = useState<ThresholdSettings>({
    humidityMin: 60,
    humidityMax: 70,
    moistureMin: 40,
    moistureMax: 60,
    temperature: 25,
    npkRatioN: 120,
    npkRatioP: 85,
    npkRatioK: 95,
  })

  useEffect(() => {
    if (!db) {
      console.warn("[v0] Firebase not available, using mock data")
      return
    }

    const unsubscribeReadings = onSnapshot(doc(db, "readings", "latest"), (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        setSensorData({
          temperature: data.temperature || 25.4,
          humidity: data.humidity || 68,
          moisture: data.moisture || 45,
          N: data.N || 120,
          P: data.P || 85,
          K: data.K || 95,
          lastUpdated: new Date().toLocaleTimeString(),
        })
      }
    })

    const unsubscribeThresholds = onSnapshot(doc(db, "thresholds", "settings"), (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        setThresholds({
          humidityMin: data.humidityMin || 60,
          humidityMax: data.humidityMax || 70,
          moistureMin: data.moistureMin || 40,
          moistureMax: data.moistureMax || 60,
          temperature: data.temperature || 25,
          npkRatioN: data.npkRatioN || 120,
          npkRatioP: data.npkRatioP || 85,
          npkRatioK: data.npkRatioK || 95,
        })
      }
    })

    return () => {
      unsubscribeReadings()
      unsubscribeThresholds()
    }
  }, [])

  useEffect(() => {
    if (!db) {
      console.warn("[v0] Firebase not available, skipping data updates")
      return
    }

    const interval = setInterval(async () => {
      const newData = {
        temperature: sensorData.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, sensorData.humidity + (Math.random() - 0.5) * 5)),
        moisture: Math.max(0, Math.min(100, sensorData.moisture + (Math.random() - 0.5) * 3)),
        N: Math.max(0, sensorData.N + (Math.random() - 0.5) * 10),
        P: Math.max(0, sensorData.P + (Math.random() - 0.5) * 8),
        K: Math.max(0, sensorData.K + (Math.random() - 0.5) * 12),
      }

      try {
        await setDoc(doc(db, "readings", "latest"), newData)
      } catch (error) {
        console.error("[v0] Error updating sensor readings:", error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [sensorData])

  const getStatusBadge = (value: number, min: number, max: number) => {
    if (value < min || value > max) {
      return <Badge variant="destructive">Alert</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
  }

  const getTemperatureStatus = (value: number, target: number) => {
    const tolerance = 3
    if (Math.abs(value - target) > tolerance) {
      return <Badge variant="destructive">Alert</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
  }

  const getNPKStatus = (value: number, target: number) => {
    const tolerance = target * 0.15 // 15% tolerance
    if (Math.abs(value - target) > tolerance) {
      return <Badge variant="destructive">Alert</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
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
              <span className="text-xs text-muted-foreground">Target: {thresholds.temperature}°C</span>
              {getTemperatureStatus(sensorData.temperature, thresholds.temperature)}
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
              <span className="text-xs text-muted-foreground">
                Range: {thresholds.humidityMin}-{thresholds.humidityMax}%
              </span>
              {getStatusBadge(sensorData.humidity, thresholds.humidityMin, thresholds.humidityMax)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorData.moisture.toFixed(0)}%</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Range: {thresholds.moistureMin}-{thresholds.moistureMax}%
              </span>
              {getStatusBadge(sensorData.moisture, thresholds.moistureMin, thresholds.moistureMax)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrared (Simulated)</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(Math.random() * 300 + 600)}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">Random value</span>
              <Badge variant="secondary">Simulated</Badge>
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
              <div className="text-lg font-semibold">{sensorData.N.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Nitrogen (N)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Target: {thresholds.npkRatioN}</span>
                {getNPKStatus(sensorData.N, thresholds.npkRatioN)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.P.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Phosphorus (P)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Target: {thresholds.npkRatioP}</span>
                {getNPKStatus(sensorData.P, thresholds.npkRatioP)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.K.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Potassium (K)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">Target: {thresholds.npkRatioK}</span>
                {getNPKStatus(sensorData.K, thresholds.npkRatioK)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
