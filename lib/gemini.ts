import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAmcl05RfWRTLM1WxucI4qLiktgxnGJ9pM')

export const gemini = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function analyzeText(prompt: string) {
  try {
    const result = await gemini.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}
