import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAmcl05RfWRTLM1WxucI4qLiktgxnGJ9pM')
const ELEVENLABS_API_KEY = 'sk_5507278ae7de294d179926914a2a62f4c61bf0dc3f3c0da8'

export async function POST(request: Request) {
  try {
    const { spokenText } = await request.json()

    if (!spokenText) {
      return NextResponse.json(
        { success: false, error: 'No spoken text provided' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp'
    })

    const prompt = `You are a speech therapist AI helping someone with a speech impediment improve their pronunciation.

The user said: "${spokenText}"

Analyze their speech and provide detailed, helpful feedback. Break down EACH WORD they said and explain how to pronounce it correctly.

Return JSON with this structure:
{
  "accuracy": <number 0-100 - clarity score based on common speech patterns>,
  "wordBreakdown": "<Break down EACH word they said. For each word, show:\n- The word\n- How to say it phonetically (like 'HEL-lo' or 'THANGK yoo')\n- Specific tips for that word\n\nFormat clearly with line breaks between words>",
  "pronunciationTips": "<General tips for improving their speech clarity - focus on common issues like:\n- Speaking slower\n- Emphasizing consonants\n- Mouth positioning\n- Breathing>",
  "improvements": "<Specific areas to work on based on what they said>",
  "encouragement": "<Positive, supportive message - be genuinely encouraging>",
  "feedbackText": "<Brief spoken feedback to read aloud - 1-2 sentences, very encouraging>"
}

Be detailed, supportive, clear, and simple. Break down every single word they said with pronunciation guidance.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text().trim()

    // Clean up markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const feedback = JSON.parse(text)

    // Generate spoken feedback using ElevenLabs
    let feedbackAudio = null
    if (feedback.feedbackText) {
      try {
        const ttsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
              text: feedback.feedbackText,
              model_id: 'eleven_monolingual_v1',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
              }
            })
          }
        )

        if (ttsResponse.ok) {
          const audioBuffer = await ttsResponse.arrayBuffer()
          feedbackAudio = Buffer.from(audioBuffer).toString('base64')
        }
      } catch (ttsError) {
        console.error('TTS error:', ttsError)
      }
    }

    return NextResponse.json({
      success: true,
      feedback: {
        accuracy: feedback.accuracy,
        wordBreakdown: feedback.wordBreakdown,
        pronunciationTips: feedback.pronunciationTips,
        improvements: feedback.improvements,
        encouragement: feedback.encouragement
      },
      feedbackAudio
    })
  } catch (error) {
    console.error('Speech analysis error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      },
      { status: 500 }
    )
  }
}
