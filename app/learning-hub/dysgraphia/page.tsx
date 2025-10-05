'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Tesseract from 'tesseract.js'

export default function DysgraphiaSupport() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const recognitionRef = useRef<any>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [overallInsights, setOverallInsights] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fontSize, setFontSize] = useState(20)
  const [fontFamily, setFontFamily] = useState('Comic Sans MS')
  const [isListening, setIsListening] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Setup speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')

        setText(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
    }
  }, [])

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
        const response = await fetch('/api/ocr-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        })

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setText(data.text || 'Could not read text')
        setIsProcessing(false)
        stopCamera()
      } catch (error: any) {
        console.error('OCR error:', error)
        setIsProcessing(false)
        alert(error?.message || 'Failed to extract text. Please try again.')
      }
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const analyzeText = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/check-spelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setOverallInsights(data.overallInsights || 'Analysis complete!')
      setShowSuggestionPopup(true)
      setIsAnalyzing(false)
    } catch (error) {
      console.error('Analysis error:', error)
      setIsAnalyzing(false)
      alert('Failed to analyze text. Please try again.')
    }
  }

  const applySuggestion = (suggestion: any) => {
    const newText = text.replace(suggestion.original, suggestion.corrected)
    setText(newText)
    setSuggestions(suggestions.filter(s => s !== suggestion))
  }

  const readAloud = async () => {
    if (!text || isReading) return

    setIsReading(true)

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()

        audioRef.current.onended = () => {
          setIsReading(false)
        }
      }
    } catch (error) {
      console.error('TTS error:', error)
      setIsReading(false)
      alert('Failed to read text aloud. Please try again.')
    }
  }

  const stopReading = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsReading(false)
  }

  const templates = [
    { name: 'Running Late', text: 'I am running late. I will be there soon.' },
    { name: 'Need Help', text: 'I need help with this, please.' },
    { name: 'Thank You', text: 'Thank you for your help!' },
    { name: 'On My Way', text: 'I am on my way now.' }
  ]

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-blue-600">Loading...</div>
    </div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <nav className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="px-6 py-3 bg-white text-green-700 rounded-full font-semibold border-2 border-green-300 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md"
        >
          ← Home
        </Link>
        <h1 className="text-3xl font-bold text-green-900">Dysgraphia Support</h1>
        <div className="w-32"></div>
      </nav>

      <audio ref={audioRef} className="hidden" />

      {/* Spelling Suggestions Popup */}
      {showSuggestionPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-green-900">Grammar Check Results</h2>
              <button
                onClick={() => setShowSuggestionPopup(false)}
                className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 font-medium text-lg transition-all"
              >
                Close
              </button>
            </div>

            {overallInsights && (
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Analysis Summary</h3>
                <p className="text-blue-900 text-lg leading-relaxed">{overallInsights}</p>
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(overallInsights)
                    utterance.rate = 0.9
                    utterance.pitch = 1
                    window.speechSynthesis.speak(utterance)
                  }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium text-lg transition-all"
                >
                  Read Analysis Aloud
                </button>
              </div>
            )}

            {suggestions.length > 0 ? (
              <div className="space-y-6">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 shadow-sm">
                  <div className="grid grid-cols-1 gap-6 mb-4">
                    <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                      <p className="text-base font-semibold text-gray-700 mb-2">Original Word:</p>
                      <p className="text-3xl text-red-700 line-through font-bold">{suggestion.original}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl border-2 border-green-300">
                      <p className="text-base font-semibold text-gray-700 mb-2">Corrected Word:</p>
                      <p className="text-3xl text-green-700 font-bold">{suggestion.corrected}</p>
                    </div>
                  </div>

                  {suggestion.visual && (
                    <div className="mt-4 p-5 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
                      <p className="text-base font-semibold text-purple-900 mb-2">How to Remember:</p>
                      <p className="text-lg text-gray-900 leading-relaxed">{suggestion.visual}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="flex-1 px-6 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 font-semibold text-lg transition-all shadow-md hover:shadow-lg"
                    >
                      Apply This Correction
                    </button>
                    <button
                      onClick={() => {
                        const textToRead = `Original word: ${suggestion.original}. Corrected word: ${suggestion.corrected}. ${suggestion.visual ? 'Memory aid: ' + suggestion.visual : ''}`
                        const utterance = new SpeechSynthesisUtterance(textToRead)
                        utterance.rate = 0.85
                        utterance.pitch = 1
                        window.speechSynthesis.speak(utterance)
                      }}
                      className="px-6 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold text-lg transition-all shadow-md hover:shadow-lg"
                    >
                      Read Aloud
                    </button>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl text-center border-2 border-green-300">
                <p className="text-green-900 text-xl font-medium">No errors found! Your writing looks great.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="bg-white rounded-3xl p-8 border-2 border-green-200 shadow-lg">
            <h2 className="text-2xl font-bold text-green-900 mb-4">Camera Text Scanner</h2>

            <div className="relative bg-black rounded-2xl overflow-hidden mb-4" style={{ height: '300px' }}>
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
                    <p className="text-xl mb-4 font-medium">Scan text from books or notes</p>
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 font-bold text-xl shadow-lg hover:shadow-xl transition-all"
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
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                >
                  {isProcessing ? 'Scanning Text...' : 'Scan Text from Camera'}
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                >
                  Stop Camera
                </button>
              </div>
            )}
          </div>

          {/* Writing Area */}
          <div className="bg-white rounded-3xl p-8 border-2 border-green-200 shadow-lg">
            <h2 className="text-2xl font-bold text-green-900 mb-4">Write or Dictate</h2>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or use voice dictation..."
              className="w-full h-48 p-4 rounded-2xl border-2 border-green-200 focus:border-green-500 outline-none resize-none text-gray-900"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily,
                lineHeight: '2em',
                color: '#000000'
              }}
            />

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-green-900 mb-2">Font Size: {fontSize}px</label>
                <input
                  type="range"
                  min="14"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-green-900 mb-2">Font Style</label>
                <div className="flex gap-2">
                  {['Comic Sans MS', 'Arial', 'Verdana'].map(font => (
                    <button
                      key={font}
                      onClick={() => setFontFamily(font)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        fontFamily === font
                          ? 'bg-green-600 text-white'
                          : 'bg-green-100 text-green-900'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Start Voice Dictation
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex-1 px-6 py-3 bg-red-700 text-white rounded-full animate-pulse font-semibold text-lg shadow-lg"
                  >
                    Stop Voice Dictation
                  </button>
                )}
                {!isReading ? (
                  <button
                    onClick={readAloud}
                    disabled={!text}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Read Text Aloud
                  </button>
                ) : (
                  <button
                    onClick={stopReading}
                    className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 font-semibold text-lg shadow-lg"
                  >
                    Stop Reading
                  </button>
                )}
              </div>

              <button
                onClick={analyzeText}
                disabled={!text || isAnalyzing}
                className="w-full px-6 py-4 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 font-bold text-xl shadow-md hover:shadow-lg transition-all"
              >
                {isAnalyzing ? 'Analyzing Your Writing...' : 'Check Spelling and Grammar'}
              </button>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="mt-8 bg-white rounded-3xl p-8 border-2 border-green-200 shadow-lg">
          <h2 className="text-2xl font-bold text-green-900 mb-4">Quick Templates</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {templates.map(template => (
              <button
                key={template.name}
                onClick={() => setText(template.text)}
                className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl text-left transition-all border-2 border-green-200 hover:border-green-300 shadow-sm hover:shadow-md"
              >
                <p className="font-bold text-green-900 text-lg mb-1">{template.name}</p>
                <p className="text-base text-green-700">{template.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-3xl p-8 border-2 border-green-200 shadow-lg">
          <h3 className="text-xl font-bold text-green-900 mb-4">Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm">
              <p className="text-lg font-bold text-green-900 mb-2">Voice Dictation</p>
              <p className="text-green-800 text-base">Speak instead of typing - your words appear automatically</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <p className="text-lg font-bold text-blue-900 mb-2">Smart Corrections</p>
              <p className="text-blue-800 text-base">AI-powered spelling and grammar suggestions with visuals</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-sm">
              <p className="text-lg font-bold text-purple-900 mb-2">Camera Scan</p>
              <p className="text-purple-800 text-base">Extract text from books or handwritten notes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
