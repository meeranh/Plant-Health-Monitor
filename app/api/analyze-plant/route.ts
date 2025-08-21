import { type NextRequest, NextResponse } from "next/server"
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const DISEASE_OPTIONS = [
  'Anthracnose',
  'Cercospora Leaf Spot',
  'Powdery Mildew',
  'Phytophthora Blight',
  'Damping Off',
  'Fusarium Wilt',
  'Bacterial Spot',
  'Bacterial Soft Rot',
  'Chilli Leaf Curl Virus (ChiLCV)',
  'Mosaic Viruses',
  'Tomato Spotted Wilt Virus'
]

interface SensorReadings {
  temperature: number
  humidity: number
  soilMoisture: number
  lightLevel: number
  phLevel?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
}

export async function POST(request: NextRequest) {
  try {
    const { image, sensorReadings } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Format sensor readings for the prompt - now properly using the passed data
    const sensorData = sensorReadings ? 
      `Current Environmental Conditions:
Temperature: ${sensorReadings.temperature?.toFixed(1) || 'N/A'}°C
Humidity: ${sensorReadings.humidity?.toFixed(0) || 'N/A'}%
Soil Moisture: ${sensorReadings.soilMoisture?.toFixed(0) || 'N/A'}%
Light Level (Infrared): ${sensorReadings.lightLevel || sensorReadings.infrared || 'N/A'}
pH Level: ${sensorReadings.phLevel?.toFixed(1) || 'N/A'}

Current Nutrient Levels:
Nitrogen (N): ${sensorReadings.nitrogen || 'N/A'}
Phosphorus (P): ${sensorReadings.phosphorus || 'N/A'}
Potassium (K): ${sensorReadings.potassium || 'N/A'}` : 
      'No sensor readings available - using visual analysis only'

    const prompt = `Analyze this chilli plant image for diseases and health issues.

DISEASE DETECTION:
Only choose one of these diseases, or say "Healthy" if no disease is detected:
${DISEASE_OPTIONS.join(', ')}

SENSOR DATA:
${sensorData}

CONTROL OPTIONS AVAILABLE:
- NPK nutrient supply adjustment
- Temperature control
- Humidity control  
- Watering schedule (amount per hour)
- RGB lighting control (percentages)

ANALYSIS REQUIREMENTS:
1. Examine the plant image carefully for signs of disease, discoloration, spots, wilting, or other abnormalities
2. Consider how the current sensor readings might be contributing to any observed issues
3. If sensor readings are suboptimal, explain how they might be affecting plant health
4. Provide specific numerical recommendations for any environmental or nutrient adjustments needed

Please respond in this exact JSON format:
{
  "status": "healthy" or "diseased",
  "disease": "exact disease name from the list above or null if healthy",
  "confidence": number between 0-100,
  "issue": "brief description of the main issue observed or null if healthy",
  "recommendations": "detailed markdown-formatted recommendations including specific numerical values for any adjustments to NPK, temperature, humidity, watering amounts, or RGB lighting percentages"
}

Focus on practical, actionable advice with specific values when sensor adjustments are needed.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    })

    const aiResponse = response.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error("No response from OpenAI API")
    }

    // Try to parse the JSON response
    let parsedResponse
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse
      parsedResponse = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      // Fallback parsing if JSON parsing fails
      parsedResponse = {
        status: aiResponse.toLowerCase().includes('healthy') ? 'healthy' : 'diseased',
        disease: null,
        confidence: 85,
        issue: aiResponse.includes('disease') ? "Unable to parse detailed analysis" : null,
        recommendations: aiResponse
      }
    }

    return NextResponse.json({
      diagnosis: parsedResponse.disease || (parsedResponse.status === 'healthy' ? 'Healthy Plant' : 'Unknown Issue'),
      status: parsedResponse.status,
      confidence: parsedResponse.confidence || 85,
      issue: parsedResponse.issue,
      recommendations: parsedResponse.recommendations,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error("Error analyzing plant:", error)
    return NextResponse.json({ 
      error: "Failed to analyze plant image",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
