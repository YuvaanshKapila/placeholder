import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyCvUMD5h5QK_e-m3DP7aFibEqBVQTGYiTE')

export async function POST(request: Request) {
  try {
    const { problem } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: 'No problem provided' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
      }
    })

    const prompt = `You are an expert, patient math tutor specializing in helping people with dyscalculia (difficulty understanding numbers and math concepts).

**Math Problem Detected from Image:**
"${problem}"

**IMPORTANT INSTRUCTIONS:**

1. **First, interpret the problem**: The text above was extracted using OCR from an image and may have errors. Common OCR mistakes include:
   - "5" might look like "S" or "s"
   - "+" might look like "t" or "+"
   - "=" might look like "—" or "-"
   - "x" (multiplication) might look like "X" or "*"
   - Numbers might be confused with letters (0/O, 1/I/l, etc.)
   - "|" might be "1" or "I"

   Please intelligently interpret what the actual math problem is by looking for patterns that resemble math equations.

2. **Solve the problem step-by-step** with:
   - Very simple, clear language (as if explaining to a child)
   - One operation per step
   - Visual descriptions using objects (apples, blocks, etc.)
   - Encouragement and positive reinforcement

3. **Create visual aids**: Describe exactly how to visualize this problem using:
   - Physical objects (blocks, counters, fingers)
   - Number lines (draw the jumps)
   - Arrays or groups
   - Pie charts or fraction bars
   - Real-world examples

**Response Format (valid JSON only):**
{
  "interpretedProblem": "The actual math problem (e.g., '5 + 5')",
  "answer": "10",
  "steps": [
    "Step 1: We start with 5 (imagine 5 apples)",
    "Step 2: We add 5 more apples to our group",
    "Step 3: Now count all the apples: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10!",
    "Step 4: So 5 + 5 = 10"
  ],
  "visual": "Draw 5 circles on the left, draw 5 circles on the right, then count all 10 circles together. Or use your fingers: hold up 5 fingers on each hand and count them all!",
  "encouragement": "Great job! You're doing amazing!"
}

**Examples of good responses:**

For "3 + 2":
{
  "interpretedProblem": "3 + 2",
  "answer": "5",
  "steps": [
    "Start with 3 items (like 3 toy cars)",
    "Add 2 more items to your collection",
    "Count them all together: 1, 2, 3, 4, 5",
    "So 3 + 2 = 5"
  ],
  "visual": "Imagine 3 red blocks and 2 blue blocks. Put them in a line and count: that's 5 blocks total! You can also use a number line: start at 3, jump forward 2 spaces (4, 5) and land on 5!",
  "encouragement": "Perfect! You understand addition!"
}

Return ONLY valid JSON, no extra text before or after.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from the response
    let parsedResponse
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
      parsedResponse = JSON.parse(jsonText)
    } catch (e) {
      // If JSON parsing fails, create a structured response from the text
      parsedResponse = {
        interpretedProblem: problem,
        answer: 'See solution below',
        steps: text.split('\n').filter(line => line.trim().length > 0),
        visual: 'Visual representation varies based on the problem type',
        encouragement: 'Keep practicing!'
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error('Math solving error:', error)
    return NextResponse.json(
      { error: 'Failed to solve problem' },
      { status: 500 }
    )
  }
}
