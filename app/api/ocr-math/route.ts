import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyCvUMD5h5QK_e-m3DP7aFibEqBVQTGYiTE')

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    })

    // Remove the data:image/png;base64, prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '')

    const prompt = `You are an OCR system specialized in reading math problems from images.

Look at this image and extract ONLY the math problem you see.

Rules:
- Return ONLY the math equation/problem, nothing else
- If you see "5+5", return exactly "5+5"
- If you see "10-3", return exactly "10-3"
- Common numbers that might look unclear: make your best guess
- Do NOT solve it, just extract what you see
- Do NOT add explanations
- If you cannot read it clearly, return "UNCLEAR"

Example responses:
- "5+5"
- "12*3"
- "100/4"
- "25-17"

Extract the math problem:`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/png'
        }
      }
    ])

    const response = result.response
    const extractedText = response.text().trim()

    return NextResponse.json({ problem: extractedText })
  } catch (error: any) {
    console.error('OCR error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process image' },
      { status: 500 }
    )
  }
}
