import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDXZ4vrMcqKBTpFILxmY8f4Ulkh1D5bJmw')

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
