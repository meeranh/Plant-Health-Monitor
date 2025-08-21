"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, RotateCcw, Leaf, Thermometer } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"

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

export function ThresholdControls() {
  const [settings, setSettings] = useState<ThresholdSettings>({
    humidityMin: 60,
    humidityMax: 70,
    moistureMin: 40,
    moistureMax: 60,
    temperature: 25,
    npkRatioN: 120,
    npkRatioP: 85,
    npkRatioK: 95,
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!db) {
      console.warn("[v0] Firebase not available, using default settings")
      return
    }

    const unsubscribe = onSnapshot(doc(db, "thresholds", "settings"), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ThresholdSettings
        setSettings(data)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!db) {
      console.error("[v0] Firebase not available, cannot save settings")
      return
    }

    setIsSaving(true)
    try {
      await setDoc(doc(db, "thresholds", "settings"), settings)
      console.log("[v0] Settings saved to Firebase successfully")
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    const defaultSettings = {
      humidityMin: 60,
      humidityMax: 70,
      moistureMin: 40,
      moistureMax: 60,
      temperature: 25,
      npkRatioN: 120,
      npkRatioP: 85,
      npkRatioK: 95,
    }
    setSettings(defaultSettings)
  }

  return (
    <div className="space-y-6">
      {/* Environmental Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-muted-foreground" />
            Environmental Controls
          </CardTitle>
          <CardDescription>Temperature, humidity, and moisture thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Target Temperature (°C)</Label>
            <Input
              type="number"
              value={settings.temperature}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  temperature: Number(e.target.value),
                }))
              }
            />
          </div>

          {/* Humidity */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Humidity Range (%)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.humidityMin}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      humidityMin: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.humidityMax}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      humidityMax: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Moisture */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Moisture Range (%)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.moistureMin}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      moistureMin: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.moistureMax}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      moistureMax: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NPK Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-muted-foreground" />
            NPK Target Values
          </CardTitle>
          <CardDescription>Single target values for optimal nutrient levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className="space-y-2 p-4 rounded-lg border">
              <Label className="font-medium">Nitrogen (N)</Label>
              <Input
                type="number"
                value={settings.npkRatioN}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    npkRatioN: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Phosphorus */}
            <div className="space-y-2 p-4 rounded-lg border">
              <Label className="font-medium">Phosphorus (P)</Label>
              <Input
                type="number"
                value={settings.npkRatioP}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    npkRatioP: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Potassium */}
            <div className="space-y-2 p-4 rounded-lg border">
              <Label className="font-medium">Potassium (K)</Label>
              <Input
                type="number"
                value={settings.npkRatioK}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    npkRatioK: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save to Firebase"}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}
