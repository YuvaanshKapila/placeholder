import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAmcl05RfWRTLM1WxucI4qLiktgxnGJ9pM')

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
      }
    })

    // Convert base64 to image part
    const imagePart = {
      inlineData: {
        data: image.split(',')[1],
        mimeType: 'image/jpeg'
      }
    }

    const prompt = `Analyze this image for crowd detection. Count people and tell where they are.

Return a JSON response with this exact structure:
{
  "peopleCount": <number of people detected>,
  "crowdDensity": "<low|medium|high|very-high>",
  "estimatedDecibelLevel": <number between 35-85>,
  "recommendation": "<simple spatial directions like 'People on your left' or 'Crowd ahead' or 'Area is clear'>",
  "spatialGuidance": "<detailed direction: describe WHERE people are - left, right, ahead, behind, center. Be specific and simple.>",
  "boxes": [
    {
      "x": <normalized 0-1 x position>,
      "y": <normalized 0-1 y position>,
      "width": <normalized 0-1 width>,
      "height": <normalized 0-1 height>
    }
  ]
}

Crowd density:
- low: 0-5 people (42 dB)
- medium: 6-15 people (58 dB)
- high: 16-30 people (70 dB)
- very-high: 31+ people (80 dB)

For spatialGuidance, give clear simple directions:
- "People on your left side"
- "Crowd directly ahead of you"
- "People scattered around - mostly on right"
- "Small group in front, clear on sides"
- "Area is clear, no people detected"

Return ONLY valid JSON, no markdown.`

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    let text = response.text().trim()

    // Clean up markdown formatting if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const analysis = JSON.parse(text)

    return NextResponse.json({
      success: true,
      data: analysis
    })
  } catch (error) {
    console.error('Crowd analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      },
      { status: 500 }
    )
  }
}
