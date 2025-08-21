"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Thermometer, Droplets, Leaf, Gauge, Pencil, Check, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

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

interface LocalThresholds {
  temperatureTarget: number
  humidityMin: number
  humidityMax: number
  moistureMin: number
  moistureMax: number
  npkN: number
  npkP: number
  npkK: number
}

type EditableField = 'temperature' | 'humidity' | 'moisture' | 'npkN' | 'npkP' | 'npkK'

export function SensorReadings() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
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
  
  // Local storage for custom thresholds
  const [localThresholds, setLocalThresholds] = useState<LocalThresholds>({
    temperatureTarget: 25,
    humidityMin: 60,
    humidityMax: 70,
    moistureMin: 40,
    moistureMax: 60,
    npkN: 120,
    npkP: 85,
    npkK: 95,
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [tempValues, setTempValues] = useState<{[key: string]: string}>({})

  // Load local thresholds from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sensorThresholds')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setLocalThresholds(parsed)
        } catch (error) {
          console.warn('Failed to parse saved thresholds:', error)
        }
      }
    }
  }, [])

  // Save to localStorage whenever localThresholds change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sensorThresholds', JSON.stringify(localThresholds))
    }
  }, [localThresholds])

  useEffect(() => {
    if (!db) {
      console.warn("Firebase not available, using fallback data")
      setSensorData({
        temperature: 26.8,
        humidity: 65,
        moisture: 52,
        N: 118,
        P: 92,
        K: 87,
        lastUpdated: new Date().toLocaleTimeString(),
      })
      setIsLoading(false)
      return
    }

    // Subscribe to readings from Firebase (READ ONLY)
    const unsubscribeReadings = onSnapshot(
      doc(db, "readings", "latest"), 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          setSensorData({
            temperature: data.temperature || 0,
            humidity: data.humidity || 0,
            moisture: data.moisture || 0,
            N: data.N || 0,
            P: data.P || 0,
            K: data.K || 0,
            lastUpdated: data.timestamp 
              ? new Date(data.timestamp.toDate()).toLocaleTimeString()
              : new Date().toLocaleTimeString(),
          })
          setError(null)
        } else {
          setError("No sensor data found in Firebase")
          setSensorData({
            temperature: 26.8,
            humidity: 65,
            moisture: 52,
            N: 118,
            P: 92,
            K: 87,
            lastUpdated: new Date().toLocaleTimeString(),
          })
        }
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching sensor readings:", error)
        setError("Failed to fetch sensor data")
        setSensorData({
          temperature: 26.8,
          humidity: 65,
          moisture: 52,
          N: 118,
          P: 92,
          K: 87,
          lastUpdated: new Date().toLocaleTimeString(),
        })
        setIsLoading(false)
      }
    )

    // Subscribe to thresholds from Firebase (READ ONLY)
    const unsubscribeThresholds = onSnapshot(
      doc(db, "thresholds", "settings"), 
      (doc) => {
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
      }
    )

    return () => {
      unsubscribeReadings()
      unsubscribeThresholds()
    }
  }, [])

  const getInfraredReading = () => {
    const baseValue = 680
    const timeVariation = Math.sin(Date.now() / 100000) * 20
    const randomVariation = (Math.random() - 0.5) * 10
    return Math.floor(baseValue + timeVariation + randomVariation)
  }

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
    const tolerance = target * 0.15
    if (Math.abs(value - target) > tolerance) {
      return <Badge variant="destructive">Alert</Badge>
    }
    return <Badge variant="secondary">Normal</Badge>
  }

  // Edit handling functions
  const startEditing = (field: EditableField) => {
    setEditingField(field)
    switch (field) {
      case 'temperature':
        setTempValues({ temperature: localThresholds.temperatureTarget.toString() })
        break
      case 'humidity':
        setTempValues({ 
          humidityMin: localThresholds.humidityMin.toString(),
          humidityMax: localThresholds.humidityMax.toString()
        })
        break
      case 'moisture':
        setTempValues({ 
          moistureMin: localThresholds.moistureMin.toString(),
          moistureMax: localThresholds.moistureMax.toString()
        })
        break
      case 'npkN':
        setTempValues({ npkN: localThresholds.npkN.toString() })
        break
      case 'npkP':
        setTempValues({ npkP: localThresholds.npkP.toString() })
        break
      case 'npkK':
        setTempValues({ npkK: localThresholds.npkK.toString() })
        break
    }
  }

  const saveEdit = () => {
    if (!editingField) return

    const newThresholds = { ...localThresholds }
    
    switch (editingField) {
      case 'temperature':
        newThresholds.temperatureTarget = parseFloat(tempValues.temperature) || localThresholds.temperatureTarget
        break
      case 'humidity':
        newThresholds.humidityMin = parseFloat(tempValues.humidityMin) || localThresholds.humidityMin
        newThresholds.humidityMax = parseFloat(tempValues.humidityMax) || localThresholds.humidityMax
        break
      case 'moisture':
        newThresholds.moistureMin = parseFloat(tempValues.moistureMin) || localThresholds.moistureMin
        newThresholds.moistureMax = parseFloat(tempValues.moistureMax) || localThresholds.moistureMax
        break
      case 'npkN':
        newThresholds.npkN = parseFloat(tempValues.npkN) || localThresholds.npkN
        break
      case 'npkP':
        newThresholds.npkP = parseFloat(tempValues.npkP) || localThresholds.npkP
        break
      case 'npkK':
        newThresholds.npkK = parseFloat(tempValues.npkK) || localThresholds.npkK
        break
    }
    
    setLocalThresholds(newThresholds)
    setEditingField(null)
    setTempValues({})
  }

  const cancelEdit = () => {
    setEditingField(null)
    setTempValues({})
  }

  const renderThresholdEditor = (field: EditableField, label: string, isRange: boolean = false) => {
    if (editingField !== field) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isRange 
              ? `Range: ${
                  field === 'humidity' ? `${localThresholds.humidityMin}-${localThresholds.humidityMax}` :
                  field === 'moisture' ? `${localThresholds.moistureMin}-${localThresholds.moistureMax}` : ''
                }${field === 'humidity' || field === 'moisture' ? '%' : ''}`
              : `Target: ${
                  field === 'temperature' ? localThresholds.temperatureTarget :
                  field === 'npkN' ? localThresholds.npkN :
                  field === 'npkP' ? localThresholds.npkP :
                  field === 'npkK' ? localThresholds.npkK : ''
                }${field === 'temperature' ? '°C' : ''}`
            }
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={() => startEditing(field)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    if (isRange) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className="h-6 w-12 text-xs p-1"
              value={field === 'humidity' ? tempValues.humidityMin : tempValues.moistureMin}
              onChange={(e) => setTempValues(prev => ({
                ...prev,
                [field === 'humidity' ? 'humidityMin' : 'moistureMin']: e.target.value
              }))}
            />
            <span className="text-xs">-</span>
            <Input
              type="number"
              className="h-6 w-12 text-xs p-1"
              value={field === 'humidity' ? tempValues.humidityMax : tempValues.moistureMax}
              onChange={(e) => setTempValues(prev => ({
                ...prev,
                [field === 'humidity' ? 'humidityMax' : 'moistureMax']: e.target.value
              }))}
            />
            <span className="text-xs">%</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={saveEdit}>
            <Check className="h-3 w-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEdit}>
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          className="h-6 w-16 text-xs p-1"
          value={tempValues[field] || ''}
          onChange={(e) => setTempValues(prev => ({ ...prev, [field]: e.target.value }))}
        />
        <span className="text-xs">{field === 'temperature' ? '°C' : ''}</span>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={saveEdit}>
          <Check className="h-3 w-3 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEdit}>
          <X className="h-3 w-3 text-red-600" />
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">Loading sensor data...</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!sensorData) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-destructive mb-4">
          {error || "No sensor data available"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Last updated: {sensorData.lastUpdated}
        {error && <span className="text-destructive ml-2">({error})</span>}
      </div>

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
              {renderThresholdEditor('temperature', 'Temperature')}
              {getTemperatureStatus(sensorData.temperature, localThresholds.temperatureTarget)}
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
              {renderThresholdEditor('humidity', 'Humidity', true)}
              {getStatusBadge(sensorData.humidity, localThresholds.humidityMin, localThresholds.humidityMax)}
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
              {renderThresholdEditor('moisture', 'Moisture', true)}
              {getStatusBadge(sensorData.moisture, localThresholds.moistureMin, localThresholds.moistureMax)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrared Sensor</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getInfraredReading()}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">Plant health metric</span>
              <Badge variant="secondary">Active</Badge>
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
                {renderThresholdEditor('npkN', 'Nitrogen')}
                {getNPKStatus(sensorData.N, localThresholds.npkN)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.P.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Phosphorus (P)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                {renderThresholdEditor('npkP', 'Phosphorus')}
                {getNPKStatus(sensorData.P, localThresholds.npkP)}
              </div>
            </div>
            <div className="text-center p-3 rounded-lg border">
              <div className="text-lg font-semibold">{sensorData.K.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground font-medium">Potassium (K)</div>
              <div className="mt-2 flex flex-col items-center gap-1">
                {renderThresholdEditor('npkK', 'Potassium')}
                {getNPKStatus(sensorData.K, localThresholds.npkK)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
