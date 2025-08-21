import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { image, sensorReadings } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const prompt = `You are an expert plant pathologist specializing in chilli plants. Analyze this image for diseases, pests, or health issues.

Current sensor readings:
- Temperature: ${sensorReadings.temperature}°C
- Humidity: ${sensorReadings.humidity}%
- Soil Moisture: ${sensorReadings.moisture}%
- Nitrogen: ${sensorReadings.N}
- Phosphorus: ${sensorReadings.P}
- Potassium: ${sensorReadings.K}

Please provide:
1. A clear diagnosis of the plant's health
2. Confidence level (0-100%)
3. Specific recommendations considering the sensor data
4. Whether the plant is healthy or diseased

Format your response as detailed markdown with specific actionable advice.`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image", image: image },
          ],
        },
      ],
    })

    // Parse the response to extract key information
    const isHealthy = text.toLowerCase().includes("healthy") && !text.toLowerCase().includes("disease")
    const confidenceMatch = text.match(/confidence[:\s]*(\d+)%?/i)
    const confidence = confidenceMatch ? Number.parseInt(confidenceMatch[1]) : 75

    return NextResponse.json({
      diagnosis: isHealthy ? "Plant appears healthy" : "Potential issues detected",
      confidence,
      recommendations: text,
      status: isHealthy ? "healthy" : "diseased",
    })
  } catch (error) {
    console.error("Error in plant analysis:", error)
    return NextResponse.json({ error: "Failed to analyze plant image" }, { status: 500 })
  }
}
