"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Save, RotateCcw, Leaf, Thermometer, Droplets, Lightbulb } from "lucide-react"

interface ThresholdSettings {
  npk: {
    nitrogen: { min: number; max: number; interval: number }
    phosphorus: { min: number; max: number; interval: number }
    potassium: { min: number; max: number; interval: number }
  }
  environmental: {
    temperature: { min: number; max: number; interval: number }
    humidity: { min: number; max: number; interval: number }
  }
  watering: {
    amount: number
    interval: number
  }
  lighting: {
    red: number
    green: number
    blue: number
    interval: number
  }
}

export function ThresholdControls() {
  const [settings, setSettings] = useState<ThresholdSettings>({
    npk: {
      nitrogen: { min: 100, max: 150, interval: 15 },
      phosphorus: { min: 80, max: 120, interval: 15 },
      potassium: { min: 90, max: 130, interval: 15 },
    },
    environmental: {
      temperature: { min: 20, max: 30, interval: 15 },
      humidity: { min: 60, max: 70, interval: 15 },
    },
    watering: {
      amount: 5,
      interval: 5,
    },
    lighting: {
      red: 80,
      green: 60,
      blue: 40,
      interval: 15,
    },
  })

  const handleSave = () => {
    // TODO: Save to Firebase/backend
    console.log("Saving threshold settings:", settings)
    // You can add Firebase integration here using environment variables
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      npk: {
        nitrogen: { min: 100, max: 150, interval: 15 },
        phosphorus: { min: 80, max: 120, interval: 15 },
        potassium: { min: 90, max: 130, interval: 15 },
      },
      environmental: {
        temperature: { min: 20, max: 30, interval: 15 },
        humidity: { min: 60, max: 70, interval: 15 },
      },
      watering: {
        amount: 5,
        interval: 5,
      },
      lighting: {
        red: 80,
        green: 60,
        blue: 40,
        interval: 15,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* NPK Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-muted-foreground" />
            NPK Nutrient Thresholds
          </CardTitle>
          <CardDescription>Maintain nutrient levels with configurable intervals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nitrogen */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Nitrogen (N) Range</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.npk.nitrogen.min}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, nitrogen: { ...prev.npk.nitrogen, min: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.npk.nitrogen.max}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, nitrogen: { ...prev.npk.nitrogen, max: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Interval (min)</Label>
                <Input
                  type="number"
                  value={settings.npk.nitrogen.interval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, nitrogen: { ...prev.npk.nitrogen, interval: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Phosphorus */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Phosphorus (P) Range</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.npk.phosphorus.min}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, phosphorus: { ...prev.npk.phosphorus, min: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.npk.phosphorus.max}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, phosphorus: { ...prev.npk.phosphorus, max: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Interval (min)</Label>
                <Input
                  type="number"
                  value={settings.npk.phosphorus.interval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, phosphorus: { ...prev.npk.phosphorus, interval: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Potassium */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Potassium (K) Range</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.npk.potassium.min}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, potassium: { ...prev.npk.potassium, min: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.npk.potassium.max}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, potassium: { ...prev.npk.potassium, max: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Interval (min)</Label>
                <Input
                  type="number"
                  value={settings.npk.potassium.interval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      npk: { ...prev.npk, potassium: { ...prev.npk.potassium, interval: Number(e.target.value) } },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-muted-foreground" />
            Environmental Controls
          </CardTitle>
          <CardDescription>Temperature and humidity maintenance with configurable intervals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Temperature Range (°C)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.environmental.temperature.min}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        temperature: { ...prev.environmental.temperature, min: Number(e.target.value) },
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.environmental.temperature.max}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        temperature: { ...prev.environmental.temperature, max: Number(e.target.value) },
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Interval (min)</Label>
                <Input
                  type="number"
                  value={settings.environmental.temperature.interval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        temperature: { ...prev.environmental.temperature, interval: Number(e.target.value) },
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="space-y-2 p-4 rounded-lg border">
            <Label className="font-medium">Humidity Range (%)</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  value={settings.environmental.humidity.min}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        humidity: { ...prev.environmental.humidity, min: Number(e.target.value) },
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  value={settings.environmental.humidity.max}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        humidity: { ...prev.environmental.humidity, max: Number(e.target.value) },
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Interval (min)</Label>
                <Input
                  type="number"
                  value={settings.environmental.humidity.interval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environmental: {
                        ...prev.environmental,
                        humidity: { ...prev.environmental.humidity, interval: Number(e.target.value) },
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watering Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-muted-foreground" />
            Watering Schedule
          </CardTitle>
          <CardDescription>Automated watering system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Water Amount (ml)</Label>
              <Input
                type="number"
                value={settings.watering.amount}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    watering: { ...prev.watering, amount: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Interval (hours)</Label>
              <Input
                type="number"
                value={settings.watering.interval}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    watering: { ...prev.watering, interval: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground p-2 rounded border">
            Provide {settings.watering.amount}ml of water every {settings.watering.interval} hours
          </p>
        </CardContent>
      </Card>

      {/* Lighting Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-muted-foreground" />
            RGB Lighting Control
          </CardTitle>
          <CardDescription>Sunlight simulation with configurable interval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 p-4 rounded-lg border">
            <div className="space-y-2">
              <Label>Red ({settings.lighting.red}%)</Label>
              <Slider
                value={[settings.lighting.red]}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    lighting: { ...prev.lighting, red: value[0] },
                  }))
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Green ({settings.lighting.green}%)</Label>
              <Slider
                value={[settings.lighting.green]}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    lighting: { ...prev.lighting, green: value[0] },
                  }))
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Blue ({settings.lighting.blue}%)</Label>
              <Slider
                value={[settings.lighting.blue]}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    lighting: { ...prev.lighting, blue: value[0] },
                  }))
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Update Interval (minutes)</Label>
              <Input
                type="number"
                value={settings.lighting.interval}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    lighting: { ...prev.lighting, interval: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
          <div
            className="w-full h-8 rounded border"
            style={{
              backgroundColor: `rgb(${(settings.lighting.red / 100) * 255}, ${(settings.lighting.green / 100) * 255}, ${(settings.lighting.blue / 100) * 255})`,
            }}
          />
          <p className="text-sm text-muted-foreground p-2 rounded border">
            Lighting adjustments every {settings.lighting.interval} minutes
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}
