import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAmcl05RfWRTLM1WxucI4qLiktgxnGJ9pM')

export async function POST(request: Request) {
  try {
    const { crowdSensitivity, soundSensitivity, lightSensitivity, touchAvoidance, neurodivergencies } = await request.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
      }
    })

    const prompt = `You are a compassionate AI assistant specializing in neurodiversity and sensory processing.

A user has the following sensory preferences and neurodivergent profile:

**Sensory Sensitivities:**
- Crowd Sensitivity: ${crowdSensitivity}
- Sound Sensitivity: ${soundSensitivity}
- Light Sensitivity: ${lightSensitivity}
- Touch Avoidance: ${touchAvoidance}

**Neurodivergencies:** ${neurodivergencies && neurodivergencies.length > 0 ? neurodivergencies.join(', ') : 'Not specified'}

Based on this profile, write a brief, warm, and personalized 2-3 sentence summary that:
1. Acknowledges their sensory profile
2. Offers a positive, supportive insight about how these preferences help them navigate the world
3. Is written in second person ("you")

The tone should be empowering, validating, and supportive. Focus on strengths and how their preferences help them thrive.

Return ONLY the summary text, no extra formatting or labels.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const summary = response.text().trim()

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summary generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
