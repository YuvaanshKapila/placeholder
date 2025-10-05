'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import CompassLoader from '../components/CompassLoader'

export default function SpeechPractice() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [feedback, setFeedback] = useState<any>(null)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setTranscription(transcript)
          setIsListening(false)
          analyzePronunciation(transcript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          alert('Could not understand speech. Please try again.')
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscription('')
      setFeedback(null)
      setIsListening(true)
      recognitionRef.current.start()
    } else {
      alert('Speech recognition not supported in this browser. Please use Chrome or Edge.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const analyzePronunciation = async (spokenText: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText
        })
      })

      const result = await response.json()

      if (result.success) {
        setFeedback(result.feedback)

        // Play feedback audio if available
        if (result.feedbackAudio) {
          const audio = new Audio(`data:audio/mp3;base64,${result.feedbackAudio}`)
          audio.play()
        }
      } else {
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze speech')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <nav className="flex justify-center items-center mb-4 sm:mb-8 relative">
        <Link
          href="/"
          className="absolute left-0 px-3 sm:px-6 py-2 sm:py-3 bg-white/60 backdrop-blur-md text-green-700 rounded-full font-light border border-green-200 hover:bg-green-600 hover:text-white transition-all duration-300 text-sm sm:text-base"
        >
          Back to Home
        </Link>
        <h1 className="text-xl sm:text-3xl font-light text-green-900">Speech Practice</h1>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
          {/* Microphone Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-light text-green-900 mb-3 sm:mb-4">Speak Naturally</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              Press the microphone button and say any word or phrase.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 py-8" style={{ minHeight: '300px' }}>
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isAnalyzing}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full font-bold text-white shadow-xl transition-all text-sm sm:text-base ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {isListening ? 'Listening...' : 'Start'}
              </button>

              {isListening && (
                <p className="text-xs sm:text-sm text-gray-600 text-center px-4">Listening... Speak clearly</p>
              )}

              {isAnalyzing && (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <CompassLoader size="md" color="#16a34a" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Analyzing...</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-light text-green-900 mb-3 sm:mb-4">Results</h2>

            {!transcription && !feedback && (
              <div className="flex items-center justify-center h-48 sm:h-64 text-green-600/60 text-center px-4">
                <p className="text-sm sm:text-base">No analysis yet.<br />Start speaking to get feedback.</p>
              </div>
            )}

            {transcription && (
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-medium text-green-900 mb-2">What You Said:</h3>
                <p className="text-xl sm:text-2xl text-gray-900 font-semibold">{transcription}</p>
              </div>
            )}

            {feedback && (
              <div className="space-y-3 sm:space-y-4">
                {feedback.accuracy !== undefined && (
                  <div>
                    <div className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Clarity Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                      <div
                        className={`h-3 sm:h-4 rounded-full ${
                          feedback.accuracy > 80 ? 'bg-green-600' :
                          feedback.accuracy > 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${feedback.accuracy}%` }}
                      ></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{feedback.accuracy}% clear</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Feedback */}
        {feedback && (
          <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-100">
              <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-3 sm:mb-4">Pronunciation Analysis</h3>

              <div className="space-y-3 sm:space-y-4">
                {feedback.wordBreakdown && (
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-xl">
                    <div className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to Pronounce Each Word</div>
                    <div className="text-gray-700 whitespace-pre-line text-sm sm:text-base">{feedback.wordBreakdown}</div>
                  </div>
                )}

                {feedback.pronunciationTips && (
                  <div className="p-3 sm:p-4 bg-purple-50 rounded-xl">
                    <div className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Pronunciation Tips</div>
                    <div className="text-gray-700 whitespace-pre-line text-sm sm:text-base">{feedback.pronunciationTips}</div>
                  </div>
                )}

                {feedback.improvements && (
                  <div className="p-3 sm:p-4 bg-yellow-50 rounded-xl">
                    <div className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">Areas to Improve</div>
                    <p className="text-gray-700 text-sm sm:text-base">{feedback.improvements}</p>
                  </div>
                )}

                {feedback.encouragement && (
                  <div className="p-3 sm:p-4 bg-green-50 rounded-xl">
                    <div className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Keep Going</div>
                    <p className="text-gray-700 text-sm sm:text-base">{feedback.encouragement}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setFeedback(null)
                setTranscription('')
              }}
              className="w-full px-4 sm:px-6 py-3 bg-green-600 text-white rounded-full font-medium sm:font-bold hover:bg-green-700 transition-all text-sm sm:text-base"
            >
              Practice Another Word
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
