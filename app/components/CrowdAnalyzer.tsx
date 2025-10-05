'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface CrowdAnalysis {
  peopleCount: number
  crowdDensity: 'low' | 'medium' | 'high' | 'very-high'
  estimatedDecibelLevel: number
  recommendation: string
  spatialGuidance?: string
  boxes?: Array<{
    x: number
    y: number
    width: number
    height: number
    label?: string
    confidence?: number
  }>
}

export default function CrowdAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [analysis, setAnalysis] = useState<CrowdAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true) // Set streaming immediately after setting srcObject

        // Wait for the video to be ready and play
        videoRef.current.onloadedmetadata = async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.play()
              console.log('Video playing:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight)
            } catch (playErr) {
              console.error('Play error:', playErr)
              setError('Could not start video playback.')
              setIsStreaming(false)
            }
          }
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Could not access camera. Please check permissions.')
      setIsStreaming(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    setAnalysis(null)
  }

  const metricsFromCount = (count: number) => {
    if (count === 0) return { density: 'low' as const, db: 35, rec: 'No crowd detected. Very quiet area.' }
    if (count <= 5) return { density: 'low' as const, db: 42, rec: 'Very few people. Safe and quiet.' }
    if (count <= 15) return { density: 'medium' as const, db: 58, rec: 'Small crowd. Monitor noise levels.' }
    if (count <= 30) return { density: 'high' as const, db: 70, rec: 'Moderate crowd. Noise increasing.' }
    return { density: 'very-high' as const, db: 80, rec: 'Large crowd. High noise levels.' }
  }

  const analyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return

    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Browser-based people counting
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    let totalBrightness = 0
    let variance = 0
    const sampleSize = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      totalBrightness += brightness
    }
    const avgBrightness = totalBrightness / sampleSize

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      variance += Math.pow(brightness - avgBrightness, 2)
    }
    variance = variance / sampleSize

    let estimatedPeople = 0
    if (variance < 800) estimatedPeople = 0
    else if (variance < 2000) estimatedPeople = 1
    else if (variance < 3000) estimatedPeople = 2
    else if (variance < 4000) estimatedPeople = 3
    else if (variance < 5500) estimatedPeople = 5
    else if (variance < 7500) estimatedPeople = 10
    else if (variance < 10000) estimatedPeople = 20
    else estimatedPeople = 35

    const metrics = metricsFromCount(estimatedPeople)
    let analysis: CrowdAnalysis = {
      peopleCount: estimatedPeople,
      crowdDensity: metrics.density,
      estimatedDecibelLevel: metrics.db,
      recommendation: metrics.rec
    }

    // Try Gemini ONLY for spatial guidance (not people counting)
    if (estimatedPeople > 0) {
      try {
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.7)
        const response = await fetch('/api/analyze-crowd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageBase64 })
        })

        const result = await response.json()
        if (result.success && result.data?.spatialGuidance) {
          analysis.spatialGuidance = result.data.spatialGuidance
        }
      } catch (error) {
        // Gemini failed, continue without spatial guidance
        console.log('Spatial guidance unavailable')
      }
    }

    setAnalysis(analysis)
    drawOverlays(analysis)
  }, [isStreaming])

  const drawOverlays = (data: CrowdAnalysis) => {
    const overlay = overlayRef.current
    const video = videoRef.current
    if (!overlay || !video) return

    const rect = video.getBoundingClientRect()
    overlay.width = rect.width
    overlay.height = rect.height

    const octx = overlay.getContext('2d')
    if (!octx) return

    octx.clearRect(0, 0, overlay.width, overlay.height)

    const db = data.estimatedDecibelLevel ?? 0

    // Determine status based on decibels
    let bgColor = 'rgba(34, 197, 94, 0.95)' // green
    let statusText = 'SAFE'
    let statusIcon = ''

    if (db >= 75) {
      bgColor = 'rgba(239, 68, 68, 0.95)' // red
      statusText = 'AVOID'
      statusIcon = ''
    } else if (db >= 65) {
      bgColor = 'rgba(234, 88, 12, 0.95)' // orange
      statusText = 'CAUTION'
      statusIcon = ''
    } else if (db >= 55) {
      bgColor = 'rgba(234, 179, 8, 0.95)' // yellow
      statusText = 'MODERATE'
      statusIcon = ''
    }

    // Large status indicator at top
    const statusW = Math.min(overlay.width * 0.9, 400)
    const statusH = 100
    const statusX = (overlay.width - statusW) / 2
    const statusY = 20

    // Draw main status box with border
    octx.fillStyle = bgColor
    octx.fillRect(statusX, statusY, statusW, statusH)
    octx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    octx.lineWidth = 5
    octx.strokeRect(statusX, statusY, statusW, statusH)

    // Status text
    octx.fillStyle = '#ffffff'
    octx.font = 'bold 32px ui-sans-serif, system-ui'
    octx.fillText(statusText, statusX + 20, statusY + 50)

    // Decibel reading
    octx.font = 'bold 24px ui-sans-serif, system-ui'
    octx.fillText(`${Math.round(db)} dB`, statusX + 20, statusY + 82)

    // People count (bottom left)
    const peopleBoxW = 160
    const peopleBoxH = 80
    const peopleBoxX = 20
    const peopleBoxY = overlay.height - peopleBoxH - 20

    octx.fillStyle = 'rgba(0, 0, 0, 0.85)'
    octx.fillRect(peopleBoxX, peopleBoxY, peopleBoxW, peopleBoxH)
    octx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    octx.lineWidth = 2
    octx.strokeRect(peopleBoxX, peopleBoxY, peopleBoxW, peopleBoxH)

    octx.fillStyle = '#ffffff'
    octx.font = 'bold 14px ui-sans-serif, system-ui'
    octx.fillText('PEOPLE', peopleBoxX + 15, peopleBoxY + 25)
    octx.font = 'bold 36px ui-sans-serif, system-ui'
    octx.fillText(data.peopleCount.toString(), peopleBoxX + 15, peopleBoxY + 62)

    // Density indicator (bottom right)
    const densityBoxW = 180
    const densityBoxH = 80
    const densityBoxX = overlay.width - densityBoxW - 20
    const densityBoxY = overlay.height - densityBoxH - 20

    octx.fillStyle = 'rgba(0, 0, 0, 0.85)'
    octx.fillRect(densityBoxX, densityBoxY, densityBoxW, densityBoxH)
    octx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    octx.lineWidth = 2
    octx.strokeRect(densityBoxX, densityBoxY, densityBoxW, densityBoxH)

    octx.fillStyle = '#ffffff'
    octx.font = 'bold 14px ui-sans-serif, system-ui'
    octx.fillText('DENSITY', densityBoxX + 15, densityBoxY + 25)
    octx.font = 'bold 18px ui-sans-serif, system-ui'
    octx.fillText(data.crowdDensity.toUpperCase(), densityBoxX + 15, densityBoxY + 62)

    // Draw bounding boxes
    if (data.boxes && data.boxes.length > 0) {
      for (const box of data.boxes) {
        const x = box.x * overlay.width
        const y = box.y * overlay.height
        const w = box.width * overlay.width
        const h = box.height * overlay.height

        octx.strokeStyle = bgColor
        octx.lineWidth = 4
        octx.strokeRect(x, y, w, h)

        // Corner markers
        const markerSize = 12
        octx.fillStyle = bgColor
        octx.fillRect(x - markerSize/2, y - markerSize/2, markerSize, markerSize)
        octx.fillRect(x + w - markerSize/2, y - markerSize/2, markerSize, markerSize)
        octx.fillRect(x - markerSize/2, y + h - markerSize/2, markerSize, markerSize)
        octx.fillRect(x + w - markerSize/2, y + h - markerSize/2, markerSize, markerSize)
      }
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Real-time continuous analysis
  useEffect(() => {
    if (!isStreaming) return

    // Initial analysis
    const initialTimeout = setTimeout(() => analyzeFrame(), 1000)

    // Continuous analysis every 3 seconds
    const interval = setInterval(() => {
      analyzeFrame()
    }, 3000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [isStreaming, analyzeFrame])

  const getStatusInfo = (db: number) => {
    if (db >= 75) return { color: 'bg-red-500', text: 'AVOID', icon: '', textColor: 'text-red-600' }
    if (db >= 65) return { color: 'bg-orange-500', text: 'CAUTION', icon: '', textColor: 'text-orange-600' }
    if (db >= 55) return { color: 'bg-yellow-500', text: 'MODERATE', icon: '', textColor: 'text-yellow-600' }
    return { color: 'bg-green-500', text: 'SAFE', icon: '', textColor: 'text-green-600' }
  }

  const statusInfo = analysis ? getStatusInfo(analysis.estimatedDecibelLevel) : null

  return (
    <div className="max-w-6xl mx-auto">
      {/* Camera View */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-cyan-200">
        <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
          {/* Always show video element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isStreaming ? 'block' : 'none', backgroundColor: '#000' }}
          />
          <canvas
            ref={overlayRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: isStreaming ? 'block' : 'none' }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Show placeholder only when not streaming */}
          {!isStreaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 mb-6 text-lg">Camera not active</p>
              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-900/20 px-4 py-2 rounded">{error}</p>
              )}
              <button
                onClick={startCamera}
                className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-full font-bold text-lg hover:from-cyan-600 hover:to-teal-700 transition-all shadow-lg"
              >
                Start Camera
              </button>
            </div>
          )}
        </div>

        {/* Controls & Results */}
        {isStreaming && (
          <div className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50">
            {/* Loading State */}
            {!analysis && (
              <div className="bg-white rounded-2xl p-8 border-4 border-cyan-200">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mb-4"></div>
                  <p className="text-xl font-bold text-gray-700">Analyzing crowd...</p>
                  <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
                </div>
              </div>
            )}

            {/* Live Status - Always visible */}
            {analysis && statusInfo && (
              <div className="space-y-4">
                {/* Main Status Alert */}
                <div className={`${statusInfo.color} text-white rounded-2xl p-6 shadow-xl`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl font-black">{statusInfo.text}</span>
                      </div>
                      <div className="text-2xl font-bold">{Math.round(analysis.estimatedDecibelLevel)} DECIBELS</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm opacity-90 mb-1">People</div>
                      <div className="text-5xl font-black">{analysis.peopleCount}</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Explanation */}
                <div className="bg-white rounded-2xl p-8 border-4 border-cyan-200">
                  <div className="text-lg font-black text-gray-900 mb-4">WHAT THIS MEANS</div>
                  <div className="space-y-4 text-gray-800">
                    <div>
                      <div className="font-bold text-xl mb-2">Number of People: {analysis.peopleCount}</div>
                      <p className="text-base leading-relaxed">{
                        analysis.peopleCount === 0 ? 'No people detected. The area is empty and quiet.' :
                        analysis.peopleCount <= 2 ? 'Very few people around you. This is a calm and comfortable environment.' :
                        analysis.peopleCount <= 5 ? 'A small group of people. The area is manageable and not crowded.' :
                        analysis.peopleCount <= 15 ? 'A moderate number of people. You may notice some background noise and activity.' :
                        analysis.peopleCount <= 30 ? 'Many people are present. Expect increased noise levels and less personal space.' :
                        'A large crowd detected. High noise levels and limited space. Consider leaving if you feel uncomfortable.'
                      }</p>
                    </div>

                    <div>
                      <div className="font-bold text-xl mb-2">Noise Level: {Math.round(analysis.estimatedDecibelLevel)} Decibels</div>
                      <p className="text-base leading-relaxed">{
                        analysis.estimatedDecibelLevel < 55 ? 'Quiet environment, similar to a library or quiet conversation. You should feel comfortable here.' :
                        analysis.estimatedDecibelLevel < 65 ? 'Moderate noise level, like a busy office or restaurant. Some people may find this manageable.' :
                        analysis.estimatedDecibelLevel < 75 ? 'Loud environment, similar to heavy traffic or a busy street. This may be uncomfortable for sensitive hearing.' :
                        'Very loud environment, like a concert or construction site. This can be overwhelming. It is recommended to leave or use ear protection.'
                      }</p>
                    </div>

                    {analysis.spatialGuidance && (
                      <div>
                        <div className="font-bold text-xl mb-2">Where People Are:</div>
                        <p className="text-base leading-relaxed font-semibold text-cyan-900">{analysis.spatialGuidance}</p>
                      </div>
                    )}

                    <div>
                      <div className="font-bold text-xl mb-2">What You Should Do:</div>
                      <p className="text-base leading-relaxed font-semibold">{analysis.recommendation}</p>
                      <p className="text-base leading-relaxed mt-2">{
                        statusInfo.text === 'SAFE' ? 'This is a safe and comfortable space. You can stay here as long as you need.' :
                        statusInfo.text === 'MODERATE' ? 'The environment is becoming busier. Monitor how you feel. If you start feeling uncomfortable, consider moving to a quieter area.' :
                        statusInfo.text === 'CAUTION' ? 'The crowd is getting larger and louder. It may be a good time to prepare to leave. Find a quieter location nearby.' :
                        'This environment is too loud and crowded. Leave immediately. Move to a quieter, less crowded area. Use noise-canceling headphones if available.'
                      }</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stop Button */}
            <button
              onClick={stopCamera}
              className="w-full mt-6 py-4 bg-gray-700 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all"
            >
              STOP CAMERA
            </button>
          </div>
        )}
      </div>

      {/* Clear Legend */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border-4 border-cyan-200">
        <h3 className="font-black text-2xl text-gray-900 mb-6">GUIDE</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-lg text-gray-700 mb-3">Noise Levels</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                <span className="font-semibold">SAFE: Under 55 dB</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                <span className="font-semibold">MODERATE: 55-65 dB</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
                <span className="font-semibold">CAUTION: 65-75 dB</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg"></div>
                <span className="font-semibold">AVOID: 75+ dB</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-700 mb-3">What to Do</h4>
            <div className="space-y-2 text-gray-700">
              <p><strong className="text-green-600">SAFE:</strong> Area is comfortable</p>
              <p><strong className="text-yellow-600">MODERATE:</strong> Be aware of surroundings</p>
              <p><strong className="text-orange-600">CAUTION:</strong> Consider leaving soon</p>
              <p><strong className="text-red-600">AVOID:</strong> Leave area immediately</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
