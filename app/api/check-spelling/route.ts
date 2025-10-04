import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyCvUMD5h5QK_e-m3DP7aFibEqBVQTGYiTE')

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `You are a helpful writing assistant for someone with dysgraphia (writing difficulties). Analyze the text carefully and provide helpful corrections.

Text to check: "${text}"

Please analyze this text for:
- Spelling errors
- Grammar mistakes
- Punctuation issues
- Word choice improvements

For each error found, provide:
1. The original incorrect word or phrase (exactly as it appears)
2. The corrected version
3. A simple, memorable visual aid or mnemonic to help remember the correct form

Examples of good visual aids:
- "accommodate has two c's and two m's - like a room with two beds"
- "separate has 'a rat' in the middle - sep-A-RAT-e"
- "necessary: one collar, two sleeves - one C, two S's"

Return your response as valid JSON only, no other text:
{
  "suggestions": [
    {
      "original": "teh",
      "corrected": "the",
      "visual": "Think of 'h' coming after 't' alphabetically - THE"
    }
  ],
  "overallInsights": "Brief encouraging comment about the writing"
}

If no errors are found, return:
{
  "suggestions": [],
  "overallInsights": "Great job! Your writing looks good."
}

Be encouraging and supportive. Focus on the most important errors first.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const textResponse = response.text()

    // Try to parse JSON from the response
    let parsedResponse
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = textResponse.match(/```json\n?([\s\S]*?)\n?```/) || textResponse.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : textResponse
      parsedResponse = JSON.parse(jsonText)
    } catch (e) {
      // If JSON parsing fails, return empty suggestions
      parsedResponse = {
        suggestions: []
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error('Spell check error:', error)
    return NextResponse.json(
      { error: 'Failed to check spelling' },
      { status: 500 }
    )
  }
}
