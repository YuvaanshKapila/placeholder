'use client'

import { useEffect, useRef, useState } from 'react'
import p5 from 'p5'

interface MathAnimationProps {
  solution: {
    interpretedProblem: string
    answer: string
    steps: string[]
    visual: string
    encouragement?: string
  }
  onClose: () => void
}

export default function MathAnimation({ solution, onClose }: MathAnimationProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const p5Instance = useRef<p5 | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioUrls, setAudioUrls] = useState<string[]>([])

  // Generate audio for all steps
  useEffect(() => {
    const generateAllAudio = async () => {
      setIsGeneratingAudio(true)
      const urls: string[] = []

      try {
        // Intro narration
        const introText = `Let's solve ${solution.interpretedProblem}`
        const introResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: introText })
        })
        const introBlob = await introResponse.blob()
        urls.push(URL.createObjectURL(introBlob))

        // Each step narration
        for (let i = 0; i < solution.steps.length; i++) {
          const stepText = `Step ${i + 1}. ${solution.steps[i]}`
          const response = await fetch('/api/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: stepText })
          })
          const blob = await response.blob()
          urls.push(URL.createObjectURL(blob))
        }

        // Final answer narration
        const finalText = `The answer is ${solution.answer}. ${solution.encouragement || 'Great job!'}`
        const finalResponse = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: finalText })
        })
        const finalBlob = await finalResponse.blob()
        urls.push(URL.createObjectURL(finalBlob))

        setAudioUrls(urls)
      } catch (error) {
        console.error('Audio generation error:', error)
      }

      setIsGeneratingAudio(false)
    }

    generateAllAudio()
  }, [solution])

  // Setup p5.js animation
  useEffect(() => {
    if (!canvasRef.current || p5Instance.current) return

    let animationFrame = 0
    let localStep = 0
    const maxFramesPerStep = 120 // 2 seconds at 60fps

    const sketch = (p: p5) => {
      p.setup = () => {
        // Responsive canvas size
        const width = window.innerWidth < 768 ? window.innerWidth - 32 : 800
        const height = window.innerWidth < 768 ? 400 : 600
        p.createCanvas(width, height)
        p.frameRate(60)
      }

      p.draw = () => {
        p.background(240, 235, 255)

        if (!isPlaying) {
          // Show title screen
          p.fill(100, 50, 150)
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(32)
          p.text(solution.interpretedProblem, p.width / 2, p.height / 2 - 50)
          p.textSize(20)
          p.fill(80, 40, 120)
          p.text('Click Play to Start', p.width / 2, p.height / 2 + 50)
          animationFrame = 0
          localStep = 0
          return
        }

        animationFrame++

        // Advance to next step
        if (animationFrame >= maxFramesPerStep) {
          animationFrame = 0
          localStep++
          setCurrentStep(localStep)

          // Stop animation when done
          if (localStep >= solution.steps.length + 2) {
            setIsPlaying(false)
            animationFrame = 0
            localStep = 0
            return
          }
        }

        // Determine what to draw based on problem type
        const problem = solution.interpretedProblem.toLowerCase()

        if (problem.includes('+') || problem.includes('plus') || problem.includes('add')) {
          drawAddition(p, localStep, animationFrame, maxFramesPerStep)
        } else if (problem.includes('-') || problem.includes('minus') || problem.includes('subtract')) {
          drawSubtraction(p, localStep, animationFrame, maxFramesPerStep)
        } else if (problem.includes('×') || problem.includes('*') || problem.includes('multiply')) {
          drawMultiplication(p, localStep, animationFrame, maxFramesPerStep)
        } else if (problem.includes('÷') || problem.includes('/') || problem.includes('divide')) {
          drawDivision(p, localStep, animationFrame, maxFramesPerStep)
        } else {
          drawGeneric(p, localStep, animationFrame, maxFramesPerStep)
        }

        // Display current step text
        p.fill(100, 50, 150)
        p.textAlign(p.CENTER)
        p.textSize(18)
        if (localStep === 0) {
          p.text(`Let's solve: ${solution.interpretedProblem}`, p.width / 2, 50)
        } else if (localStep <= solution.steps.length) {
          p.text(`Step ${localStep}: ${solution.steps[localStep - 1]}`, p.width / 2, 50)
        } else {
          p.text(`Answer: ${solution.answer}`, p.width / 2, 50)
        }
      }

      // Addition animation: show circles appearing
      const drawAddition = (p: p5, step: number, frame: number, maxFrames: number) => {
        const numbers = solution.interpretedProblem.match(/\d+/g)
        if (!numbers) return

        const num1 = parseInt(numbers[0])
        const num2 = parseInt(numbers[1])
        const circleSize = 40
        const spacing = 60

        // Step 0: Intro
        if (step === 0) {
          p.fill(100, 150, 255)
          p.textSize(24)
          p.textAlign(p.CENTER)
          p.text('Watch the circles appear!', p.width / 2, p.height / 2)
        }
        // Step 1: Show first number
        else if (step === 1) {
          const progress = frame / maxFrames
          const visibleCircles = Math.floor(num1 * progress)

          for (let i = 0; i < visibleCircles; i++) {
            const x = 150 + (i % 5) * spacing
            const y = 200 + Math.floor(i / 5) * spacing
            p.fill(100, 150, 255)
            p.circle(x, y, circleSize)
            p.fill(255)
            p.textSize(20)
            p.textAlign(p.CENTER, p.CENTER)
            p.text(i + 1, x, y)
          }
        }
        // Step 2: Show second number
        else if (step === 2) {
          // Keep first number
          for (let i = 0; i < num1; i++) {
            const x = 150 + (i % 5) * spacing
            const y = 200 + Math.floor(i / 5) * spacing
            p.fill(100, 150, 255)
            p.circle(x, y, circleSize)
            p.fill(255)
            p.textSize(20)
            p.textAlign(p.CENTER, p.CENTER)
            p.text(i + 1, x, y)
          }

          // Add second number with animation
          const progress = frame / maxFrames
          const visibleCircles = Math.floor(num2 * progress)

          for (let i = 0; i < visibleCircles; i++) {
            const x = 150 + ((num1 + i) % 5) * spacing
            const y = 200 + Math.floor((num1 + i) / 5) * spacing
            p.fill(255, 150, 100)
            p.circle(x, y, circleSize)
            p.fill(255)
            p.textSize(20)
            p.textAlign(p.CENTER, p.CENTER)
            p.text(num1 + i + 1, x, y)
          }
        }
        // Final step: Show total
        else {
          const total = num1 + num2
          for (let i = 0; i < total; i++) {
            const x = 150 + (i % 5) * spacing
            const y = 200 + Math.floor(i / 5) * spacing
            p.fill(100, 200, 100)
            p.circle(x, y, circleSize)
            p.fill(255)
            p.textSize(20)
            p.textAlign(p.CENTER, p.CENTER)
            p.text(i + 1, x, y)
          }

          // Show answer in big text
          p.fill(100, 200, 100)
          p.textSize(48)
          p.textAlign(p.CENTER)
          p.text(solution.answer, p.width / 2, p.height - 80)
        }
      }

      // Subtraction animation: cross out circles
      const drawSubtraction = (p: p5, step: number, frame: number, maxFrames: number) => {
        const numbers = solution.interpretedProblem.match(/\d+/g)
        if (!numbers) return

        const num1 = parseInt(numbers[0])
        const num2 = parseInt(numbers[1])
        const circleSize = 40
        const spacing = 60

        if (step === 0) {
          p.fill(100, 150, 255)
          p.textSize(24)
          p.textAlign(p.CENTER)
          p.text('Watch the circles get crossed out!', p.width / 2, p.height / 2)
        } else if (step === 1) {
          // Show all circles
          for (let i = 0; i < num1; i++) {
            const x = 150 + (i % 5) * spacing
            const y = 200 + Math.floor(i / 5) * spacing
            p.fill(100, 150, 255)
            p.circle(x, y, circleSize)
          }
        } else if (step === 2) {
          const progress = frame / maxFrames
          const crossedOut = Math.floor(num2 * progress)

          for (let i = 0; i < num1; i++) {
            const x = 150 + (i % 5) * spacing
            const y = 200 + Math.floor(i / 5) * spacing

            if (i < num1 - crossedOut) {
              p.fill(100, 150, 255)
            } else {
              p.fill(200, 100, 100)
            }
            p.circle(x, y, circleSize)

            if (i >= num1 - crossedOut) {
              p.stroke(200, 0, 0)
              p.strokeWeight(4)
              p.line(x - 20, y - 20, x + 20, y + 20)
              p.line(x + 20, y - 20, x - 20, y + 20)
              p.noStroke()
            }
          }
        } else {
          const answer = num1 - num2
          for (let i = 0; i < answer; i++) {
            const x = 150 + (i % 5) * spacing
            const y = 200 + Math.floor(i / 5) * spacing
            p.fill(100, 200, 100)
            p.circle(x, y, circleSize)
          }

          p.fill(100, 200, 100)
          p.textSize(48)
          p.textAlign(p.CENTER)
          p.text(solution.answer, p.width / 2, p.height - 80)
        }
      }

      // Multiplication animation: show groups
      const drawMultiplication = (p: p5, step: number, frame: number, maxFrames: number) => {
        const numbers = solution.interpretedProblem.match(/\d+/g)
        if (!numbers) return

        const num1 = parseInt(numbers[0])
        const num2 = parseInt(numbers[1])

        if (step === 0) {
          p.fill(100, 150, 255)
          p.textSize(24)
          p.textAlign(p.CENTER)
          p.text(`${num1} groups of ${num2}`, p.width / 2, p.height / 2)
        } else if (step === 1) {
          const progress = frame / maxFrames
          const visibleGroups = Math.floor(num1 * progress)

          for (let group = 0; group < visibleGroups; group++) {
            const groupX = 100 + (group % 3) * 250
            const groupY = 150 + Math.floor(group / 3) * 200

            p.fill(150, 100, 200)
            p.rect(groupX - 10, groupY - 10, 120, 120, 10)

            for (let i = 0; i < num2; i++) {
              const x = groupX + (i % 2) * 50 + 20
              const y = groupY + Math.floor(i / 2) * 50 + 20
              p.fill(100, 150, 255)
              p.circle(x, y, 30)
            }
          }
        } else {
          for (let group = 0; group < num1; group++) {
            const groupX = 100 + (group % 3) * 250
            const groupY = 150 + Math.floor(group / 3) * 200

            p.fill(150, 200, 150)
            p.rect(groupX - 10, groupY - 10, 120, 120, 10)

            for (let i = 0; i < num2; i++) {
              const x = groupX + (i % 2) * 50 + 20
              const y = groupY + Math.floor(i / 2) * 50 + 20
              p.fill(100, 200, 100)
              p.circle(x, y, 30)
            }
          }

          p.fill(100, 200, 100)
          p.textSize(48)
          p.textAlign(p.CENTER)
          p.text(solution.answer, p.width / 2, p.height - 60)
        }
      }

      // Division animation: split into groups
      const drawDivision = (p: p5, step: number, frame: number, maxFrames: number) => {
        const numbers = solution.interpretedProblem.match(/\d+/g)
        if (!numbers) return

        const num1 = parseInt(numbers[0])
        const num2 = parseInt(numbers[1])
        const answer = Math.floor(num1 / num2)

        if (step === 0) {
          p.fill(100, 150, 255)
          p.textSize(24)
          p.textAlign(p.CENTER)
          p.text(`Split ${num1} into ${num2} groups`, p.width / 2, p.height / 2)
        } else if (step === 1) {
          // Show all items
          for (let i = 0; i < num1; i++) {
            const x = 150 + (i % 6) * 50
            const y = 150 + Math.floor(i / 6) * 50
            p.fill(100, 150, 255)
            p.circle(x, y, 30)
          }
        } else {
          const progress = frame / maxFrames
          const visibleGroups = Math.floor(num2 * progress)

          for (let group = 0; group < visibleGroups; group++) {
            const groupX = 100 + (group % 3) * 250
            const groupY = 200 + Math.floor(group / 3) * 180

            p.fill(150, 100 + group * 30, 200)
            p.rect(groupX - 10, groupY - 10, 120, 100, 10)

            for (let i = 0; i < answer; i++) {
              const x = groupX + (i % 2) * 50 + 20
              const y = groupY + Math.floor(i / 2) * 40 + 20
              p.fill(100, 200, 100)
              p.circle(x, y, 30)
            }
          }

          if (visibleGroups === num2) {
            p.fill(100, 200, 100)
            p.textSize(36)
            p.textAlign(p.CENTER)
            p.text(`Each group has ${answer}`, p.width / 2, p.height - 60)
          }
        }
      }

      // Generic animation for other problems
      const drawGeneric = (p: p5, step: number, frame: number, maxFrames: number) => {
        p.fill(100, 150, 255)
        p.textSize(20)
        p.textAlign(p.CENTER)

        if (step === 0) {
          p.text(solution.interpretedProblem, p.width / 2, p.height / 2)
        } else if (step <= solution.steps.length) {
          p.text(solution.steps[step - 1], p.width / 2, p.height / 2)
        } else {
          p.textSize(48)
          p.fill(100, 200, 100)
          p.text(solution.answer, p.width / 2, p.height / 2)
        }
      }
    }

    p5Instance.current = new p5(sketch, canvasRef.current)

    return () => {
      p5Instance.current?.remove()
      p5Instance.current = null
    }
  }, [isPlaying, solution])

  // Play audio when step changes
  useEffect(() => {
    if (isPlaying && audioUrls[currentStep] && audioRef.current) {
      audioRef.current.src = audioUrls[currentStep]
      audioRef.current.play().catch(err => console.error('Audio play error:', err))
    }
  }, [currentStep, isPlaying, audioUrls])

  const handlePlay = () => {
    if (audioUrls.length === 0) {
      alert('Audio is still loading, please wait...')
      return
    }
    setIsPlaying(true)
    setCurrentStep(0)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-5xl w-full border-2 border-purple-300 shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-purple-900">Visual Math Explanation</h2>
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 font-medium text-base sm:text-lg transition-all"
          >
            Close
          </button>
        </div>

        <div ref={canvasRef} className="flex justify-center mb-4 sm:mb-6 bg-purple-50 rounded-xl sm:rounded-2xl p-2 sm:p-4 overflow-x-auto"></div>

        <audio ref={audioRef} className="hidden" />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handlePlay}
            disabled={isPlaying || isGeneratingAudio}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 font-bold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all"
          >
            {isGeneratingAudio ? 'Loading Audio...' : isPlaying ? 'Playing...' : 'Play Animation'}
          </button>
          <button
            onClick={handleStop}
            disabled={!isPlaying}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 font-bold text-lg sm:text-xl shadow-md hover:shadow-lg transition-all"
          >
            Stop
          </button>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-50 rounded-xl">
          <p className="text-purple-900 text-center text-base sm:text-lg">
            {isGeneratingAudio ? 'Generating narration...' : isPlaying ? `Playing step ${currentStep + 1}` : 'Click Play to start the visual explanation'}
          </p>
        </div>
      </div>
    </div>
  )
}
