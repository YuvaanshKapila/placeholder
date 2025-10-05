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
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
      }
    })

    // Convert base64 to image part
    const imagePart = {
      inlineData: {
        data: image.split(',')[1],
        mimeType: 'image/jpeg'
      }
    }

    const prompt = `You are an advanced crowd detection AI helping neurodivergent individuals navigate spaces safely.

TASK: Analyze this image and detect ALL people, their exact positions, and provide clear spatial guidance.

DETECTION RULES:
1. Count EVERY person visible - even partially visible people, people in background, people far away
2. Look for heads, faces, full bodies, silhouettes, groups
3. Check all areas: foreground, background, left, right, center
4. Detect people at different distances and angles
5. Include people who are sitting, standing, walking, or stationary

SPATIAL ANALYSIS:
- Divide image into zones: far left, left, center-left, center, center-right, right, far right
- Note distance: close (within 2 meters), medium (2-5 meters), far (5+ meters)
- Identify clusters vs scattered individuals

OUTPUT FORMAT (valid JSON only, no markdown):
{
  "peopleCount": <total number of people detected - be thorough>,
  "crowdDensity": "<low|medium|high|very-high>",
  "estimatedDecibelLevel": <realistic dB level 35-85>,
  "recommendation": "<immediate action: 'Safe to proceed' or 'Avoid left side - crowded' or 'Wait - large group ahead'>",
  "spatialGuidance": "<precise location details: 'Group of 4 people on far left at medium distance, 2 people center-right close to you, 3 people far right in background'>",
  "zones": {
    "left": <number of people>,
    "center": <number of people>,
    "right": <number of people>
  },
  "boxes": [
    {
      "x": <0-1 normalized x center>,
      "y": <0-1 normalized y center>,
      "width": <0-1 normalized width>,
      "height": <0-1 normalized height>
    }
  ]
}

DENSITY & DECIBEL MAPPING:
- low (0-3 people): 38-45 dB
- medium (4-8 people): 50-60 dB
- high (9-20 people): 65-75 dB
- very-high (21+ people): 78-85 dB

GUIDANCE EXAMPLES:
- "Clear path ahead, no crowds detected"
- "Small group of 3 on your left, path clear on right - use right side"
- "Large crowd of 12 people directly ahead - consider alternate route"
- "Scattered - 2 people far left, 1 center, 3 on right at distance"
- "Very crowded - 25+ people throughout space, avoid if possible"

BE ACCURATE. Count carefully. Return ONLY valid JSON.`

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
