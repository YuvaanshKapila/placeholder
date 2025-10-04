'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import Tesseract from 'tesseract.js'

export default function DyscalculiaSupport() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [extractedProblem, setExtractedProblem] = useState('')
  const [solution, setSolution] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSolving, setIsSolving] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          setCameraActive(true)
        }
      }
    } catch (error) {
      console.error('Camera error:', error)
      alert('Unable to access camera. Please grant camera permissions and make sure no other app is using it.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setCameraActive(false)
    }
  }

  const captureAndExtract = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (context) {
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)

      const imageData = canvas.toDataURL('image/png')

      try {
        // Use Gemini Vision API for OCR
        const response = await fetch('/api/ocr-math', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        })

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setExtractedProblem(data.problem || 'Could not read problem')
        setIsProcessing(false)
        stopCamera()
      } catch (error: any) {
        console.error('OCR error:', error)
        setIsProcessing(false)
        alert(error?.message || 'Failed to extract math problem. Please try again.')
      }
    }
  }

  const solveProblem = async () => {
    if (!extractedProblem) return

    setIsSolving(true)

    try {
      const response = await fetch('/api/solve-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: extractedProblem })
      })

      const data = await response.json()
      setSolution(data)
      setIsSolving(false)
    } catch (error) {
      console.error('Solve error:', error)
      setIsSolving(false)
      alert('Failed to solve problem')
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-blue-600">Loading...</div>
    </div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4">
      <nav className="flex justify-between items-center mb-8">
        <Link
          href="/learning-hub"
          className="px-6 py-3 bg-white/60 backdrop-blur-md text-purple-700 rounded-full font-light border border-purple-200 hover:bg-purple-600 hover:text-white transition-all duration-300"
        >
          ← Back to Hub
        </Link>
        <h1 className="text-3xl font-light text-purple-900">Dyscalculia Support</h1>
        <div className="w-32"></div>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-purple-100">
            <h2 className="text-2xl font-light text-purple-900 mb-4">Math Problem Scanner</h2>

            <div className="relative bg-black rounded-2xl overflow-hidden mb-4" style={{ height: '400px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: cameraActive ? 'block' : 'none' }}
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
                  <div>
                    <p className="text-xl mb-4">Take a photo of your math problem</p>
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {cameraActive && (
              <div className="flex gap-4">
                <button
                  onClick={captureAndExtract}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Capture Problem'}
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Problem & Solution Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-purple-100">
            <h2 className="text-2xl font-light text-purple-900 mb-4">Problem & Solution</h2>

            {extractedProblem ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-purple-900 mb-2">Detected Problem:</h3>
                  <div className="p-4 bg-purple-50 rounded-xl text-2xl font-mono text-center text-gray-900">
                    {extractedProblem}
                  </div>
                </div>

                <button
                  onClick={solveProblem}
                  disabled={isSolving}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 mb-4 font-medium"
                >
                  {isSolving ? 'Solving...' : 'Solve with Visual Steps'}
                </button>

                {solution && (
                  <div className="space-y-4">
                    {solution.interpretedProblem && (
                      <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                        <h3 className="text-lg font-medium text-yellow-900 mb-2">Gemini Interpreted:</h3>
                        <p className="text-2xl font-bold text-yellow-800 text-center">{solution.interpretedProblem}</p>
                      </div>
                    )}

                    <div className="p-4 bg-green-50 rounded-xl">
                      <h3 className="text-lg font-medium text-green-900 mb-2">Answer:</h3>
                      <p className="text-3xl font-bold text-green-700 text-center">{solution.answer}</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="text-lg font-medium text-blue-900 mb-3">Step-by-Step Solution:</h3>
                      <div className="space-y-3">
                        {solution.steps?.map((step: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                              {index + 1}
                            </div>
                            <p className="text-blue-900 pt-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {solution.visual && (
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <h3 className="text-lg font-medium text-purple-900 mb-2">Visual Representation:</h3>
                        <p className="text-purple-700 text-base leading-relaxed">{solution.visual}</p>
                      </div>
                    )}

                    {solution.encouragement && (
                      <div className="p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                        <p className="text-pink-800 text-center font-medium text-lg">{solution.encouragement}</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => { setExtractedProblem(''); setSolution(null); }}
                  className="w-full mt-4 px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                >
                  Clear & Try Another
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-purple-600/60 text-center">
                <p>No problem detected yet.<br />Capture a math problem to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Visual Examples */}
        <div className="mt-8 bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-purple-100">
          <h3 className="text-xl font-light text-purple-900 mb-4">Supported Problems</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-medium text-purple-900 mb-2">Addition</p>
              <p className="text-purple-700">Simple and multi-digit addition with visual blocks</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-medium text-purple-900 mb-2">Subtraction</p>
              <p className="text-purple-700">Step-by-step subtraction with number lines</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-medium text-purple-900 mb-2">Multiplication</p>
              <p className="text-purple-700">Arrays and groups visualization</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-medium text-purple-900 mb-2">Division</p>
              <p className="text-purple-700">Equal groups and pie chart diagrams</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-medium text-purple-900 mb-2">Fractions</p>
              <p className="text-purple-700">Visual fraction bars and circles</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-lg font-medium text-purple-900 mb-2">Word Problems</p>
              <p className="text-purple-700">Break down into simple steps with pictures</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
