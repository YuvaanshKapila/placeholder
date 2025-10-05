import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAmcl05RfWRTLM1WxucI4qLiktgxnGJ9pM')

export async function POST(request: Request) {
  try {
    const { moodLevel, preferences } = await request.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
      }
    })

    const moodLabels = {
      1: 'experiencing panic',
      2: 'very anxious',
      3: 'anxious',
      4: 'feeling uneasy',
      5: 'relatively calm'
    }

    const prompt = `You are a compassionate mental health support AI assistant.

A user is currently ${moodLabels[moodLevel as keyof typeof moodLabels]} and has the following sensory sensitivities:
- Crowd Sensitivity: ${preferences.crowdSensitivity}
- Sound Sensitivity: ${preferences.soundSensitivity}
- Light Sensitivity: ${preferences.lightSensitivity}
- Touch Avoidance: ${preferences.touchAvoidance}

Write a brief, warm, and supportive 2-3 sentence message that:
1. Validates their current emotional state
2. Acknowledges how their sensory sensitivities might be contributing to their anxiety
3. Offers gentle encouragement that the calming techniques can help

The tone should be:
- Compassionate and understanding
- Not dismissive or minimizing
- Hopeful but realistic
- Written in second person ("you")

Return ONLY the message text, no extra formatting.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const message = response.text().trim()

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Anxiety support error:', error)
    return NextResponse.json(
      { error: 'Failed to generate support message' },
      { status: 500 }
    )
  }
}
