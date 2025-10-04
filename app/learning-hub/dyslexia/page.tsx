'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import Tesseract from 'tesseract.js'

export default function DyslexiaSupport() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [currentWord, setCurrentWord] = useState(-1)
  const [fontSize, setFontSize] = useState(24)
  const [backgroundColor, setBackground] = useState('#fff5dc')

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
        const response = await fetch('/api/ocr-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData })
        })

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setExtractedText(data.text || 'Could not read text')
        setIsProcessing(false)
      } catch (error: any) {
        console.error('OCR error:', error)
        setIsProcessing(false)
        alert(error?.message || 'Failed to extract text. Please try again.')
      }
    }
  }

  const readTextAloud = async () => {
    if (!extractedText || isReading) return

    setIsReading(true)

    try {
      // Call ElevenLabs TTS API
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText })
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()

        audioRef.current.onended = () => {
          setIsReading(false)
          setCurrentWord(-1)
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
    setCurrentWord(-1)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-blue-600">Loading...</div>
    </div>
  }

  if (!user) return null

  const words = extractedText.split(/\s+/)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <nav className="flex justify-between items-center mb-8">
        <Link
          href="/learning-hub"
          className="px-6 py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          ← Back to Hub
        </Link>
        <h1 className="text-3xl font-light text-blue-900">📖 Dyslexia Support</h1>
        <div className="w-32"></div>
      </nav>

      <audio ref={audioRef} className="hidden" />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-blue-100">
            <h2 className="text-2xl font-light text-blue-900 mb-4">Camera Text Scanner</h2>

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
                    <p className="text-xl mb-4">Point camera at text to read it aloud</p>
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
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
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? 'Processing...' : 'Capture & Extract Text'}
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Text Display Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-blue-100">
            <h2 className="text-2xl font-light text-blue-900 mb-4">Extracted Text</h2>

            {extractedText ? (
              <>
                <div
                  className="p-6 rounded-2xl mb-4 overflow-y-auto text-gray-900"
                  style={{
                    backgroundColor,
                    maxHeight: '300px',
                    fontSize: `${fontSize}px`,
                    lineHeight: '2em',
                    fontFamily: 'OpenDyslexic, Arial, sans-serif',
                    color: '#000000'
                  }}
                >
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className={`${
                        index === currentWord
                          ? 'bg-yellow-300 px-1 font-bold text-gray-900'
                          : 'text-gray-900'
                      } mr-2`}
                    >
                      {word}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm text-blue-900 mb-2">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="16"
                      max="48"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-blue-900 mb-2">Background Color</label>
                    <div className="flex gap-2">
                      {['#fff5dc', '#ffffff', '#f0f0f0', '#e8f4f8', '#fef3c7'].map(color => (
                        <button
                          key={color}
                          onClick={() => setBackground(color)}
                          className={`w-10 h-10 rounded-full border-2 ${backgroundColor === color ? 'border-blue-600' : 'border-gray-300'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {!isReading ? (
                    <button
                      onClick={readTextAloud}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-medium"
                    >
                      🔊 Read Aloud
                    </button>
                  ) : (
                    <button
                      onClick={stopReading}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all font-medium"
                    >
                      ⏹ Stop Reading
                    </button>
                  )}
                  <button
                    onClick={() => setExtractedText('')}
                    className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all"
                  >
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-blue-600/60 text-center">
                <p>No text extracted yet.<br />Capture an image to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-blue-100">
          <h3 className="text-xl font-light text-blue-900 mb-4">How to Use</h3>
          <ol className="space-y-2 text-blue-600/80 list-decimal list-inside">
            <li>Click "Start Camera" to activate your device's camera</li>
            <li>Point the camera at any printed text (books, signs, documents)</li>
            <li>Click "Capture & Extract Text" when the text is clearly visible</li>
            <li>Wait for the text to be extracted and cleaned by AI</li>
            <li>Adjust the font size and background color for comfort</li>
            <li>Click "Read Aloud" to hear the text spoken with natural voice</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
