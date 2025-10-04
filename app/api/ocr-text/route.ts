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

    const prompt = `You are an expert OCR system. Extract ALL text from this image.

Rules:
- Return ONLY the text you see, nothing else
- Preserve the original structure and formatting as much as possible
- Fix obvious OCR errors (like "0" vs "O", "1" vs "I")
- Do NOT add explanations or commentary
- If the image has no readable text, return "NO_TEXT_FOUND"

Extract all text from the image:`

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

    return NextResponse.json({ text: extractedText })
  } catch (error: any) {
    console.error('OCR error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process image' },
      { status: 500 }
    )
  }
}
