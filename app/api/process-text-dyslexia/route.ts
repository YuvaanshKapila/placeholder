import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyAmcl05RfWRTLM1WxucI4qLiktgxnGJ9pM')

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = `You are an expert assistant helping someone with dyslexia read text more easily. Your task is to clean and improve OCR-extracted text.

The following text was extracted using OCR and may have errors or formatting issues:

"${text}"

Please analyze and clean this text carefully:

1. **Fix OCR Errors**: Correct common OCR mistakes like:
   - Confusing similar characters (0/O, 1/I/l, 5/S, etc.)
   - Misread punctuation
   - Spacing errors
   - Mixed case letters

2. **Improve Readability**:
   - Remove unnecessary line breaks within sentences
   - Maintain proper paragraph structure
   - Correct obvious spelling and grammar mistakes
   - Ensure proper capitalization

3. **Preserve Meaning**: Keep the original meaning and intent completely intact

Return ONLY the cleaned text without any explanations, headers, or additional commentary. Just the corrected text itself.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const cleanedText = response.text()

    return NextResponse.json({ cleanedText })
  } catch (error) {
    console.error('Text processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    )
  }
}
