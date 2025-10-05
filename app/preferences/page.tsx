'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import VoiceGuidanceToggle from '../components/VoiceGuidanceToggle'
import AccessibleButton from '../components/AccessibleButton'
import { useAccessibility } from '../context/AccessibilityContext'
import { speakOnHover, stopHoverSpeech } from '../utils/accessibility'

export default function Preferences() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  const [showWelcome, setShowWelcome] = useState(false)
  const [neurodivergencies, setNeurodivergencies] = useState<string[]>([])
  const [preferences, setPreferences] = useState({
    crowdSensitivity: 'medium',
    soundSensitivity: 'medium',
    lightSensitivity: 'medium',
    touchAvoidance: 'medium'
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      // Load saved preferences from API
      fetch(`/api/preferences?userId=${encodeURIComponent(user.sub)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.user_id) {
            setPreferences({
              crowdSensitivity: data.crowd_sensitivity || 'medium',
              soundSensitivity: data.sound_sensitivity || 'medium',
              lightSensitivity: data.light_sensitivity || 'medium',
              touchAvoidance: data.touch_avoidance || 'medium'
            })
            setNeurodivergencies(data.neurodivergencies || [])
          } else {
            // First time user - show welcome
            setShowWelcome(true)
          }
        })
        .catch(err => {
          console.error('Error loading preferences:', err)
          setShowWelcome(true)
        })
    }
  }, [user])

  const handleNeurodivergencyToggle = (type: string) => {
    setNeurodivergencies(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    // Auto-save initial selections
    handleSavePreferences()
  }

  const handleSavePreferences = async () => {
    if (!user) {
      alert('No user logged in')
      return
    }

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.sub,
          user_email: user.email,
          user_name: user.name,
          neurodivergencies,
          crowd_sensitivity: preferences.crowdSensitivity,
          sound_sensitivity: preferences.soundSensitivity,
          light_sensitivity: preferences.lightSensitivity,
          touch_avoidance: preferences.touchAvoidance
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        console.error('Failed to save preferences:', result)
        alert(`Failed to save: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save preferences'}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-xl text-blue-600 font-light">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  const { isVoiceGuidanceEnabled } = useAccessibility()

  const neurodivergencyOptions = [
    {
      id: 'adhd',
      label: 'ADHD',
      description: 'Attention Deficit Hyperactivity Disorder',
      tools: 'Focus timers, reminders, and task breakdown coming soon'
    },
    {
      id: 'autism',
      label: 'Autism',
      description: 'Autism Spectrum Disorder',
      tools: 'Sensory-friendly routes and predictable patterns coming soon'
    },
    {
      id: 'learning',
      label: 'Learning Disabilities',
      description: 'Dyslexia, Dyscalculia, Dysgraphia',
      tools: 'Text-to-Speech Reader, Math Problem Solver, and Spell Checker available now!'
    },
    {
      id: 'anxiety',
      label: 'Anxiety',
      description: 'Generalized or social anxiety',
      tools: 'Calming exercises and breathing techniques available now!'
    },
    {
      id: 'sensory',
      label: 'Sensory Processing',
      description: 'Sensory processing differences',
      tools: 'Sensory preference tracking available now!'
    },
    {
      id: 'speech',
      label: 'Speech Impediment',
      description: 'Speech and pronunciation support',
      tools: 'Speech practice and feedback available!'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-drift"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-drift-delayed"></div>
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 border border-blue-100 animate-scale-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-8">
              <div className="inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl font-extralight mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Welcome, {user.name?.split(' ')[0]}!
                </span>
              </h2>
              <p className="text-lg text-blue-600/80 font-light mb-2">
                We're so glad you're here
              </p>
              <p className="text-blue-500/60 font-light max-w-lg mx-auto">
                Your neurodivergence is valid, valued, and understood. Let's personalize your experience to make navigation comfortable and empowering for you.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-light text-blue-900 mb-4">Tell us about yourself (optional)</h3>
              <p className="text-sm text-blue-600/60 font-light mb-4">Select any that apply to help us better customize your experience:</p>

              <div className="grid md:grid-cols-2 gap-3">
                {neurodivergencyOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleNeurodivergencyToggle(option.id)}
                    onMouseEnter={() => {
                      if (isVoiceGuidanceEnabled) {
                        speakOnHover(`${option.label}. ${option.description}. ${option.tools}`)
                      }
                    }}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      neurodivergencies.includes(option.id)
                        ? 'border-blue-500 bg-blue-50/50 shadow-md'
                        : 'border-blue-100/50 bg-white/40 hover:border-blue-300/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-blue-900 text-lg">{option.label}</p>
                        <p className="text-xs text-blue-600/60 font-light">{option.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        neurodivergencies.includes(option.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-blue-300'
                      }`}>
                        {neurodivergencies.includes(option.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200/50">
                      <p className="text-xs text-blue-700 font-medium">{option.tools}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleWelcomeComplete}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-light text-lg tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Continue to Preferences
            </button>
          </div>
        </div>
      )}

      <nav className="relative z-10 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="text-2xl font-extralight tracking-widest text-blue-900 hover:text-blue-600 transition-colors">
          ← Back to Home
        </Link>
        <a
          href="/auth/logout"
          className="px-8 py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light tracking-wide border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-2xl hover:scale-105 active:scale-95"
        >
          Logout
        </a>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extralight mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Your Preferences
            </span>
          </h1>
          <p className="text-blue-600/70 font-light">Customize your sensory comfort settings</p>
        </div>

        {/* Neurodivergencies Section */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50 mb-8">
          <h2 className="text-2xl font-light text-blue-900 mb-6">Your Profile</h2>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {neurodivergencyOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleNeurodivergencyToggle(option.id)}
                onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`${option.label}. ${option.description}. ${option.tools}`)}
                onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  neurodivergencies.includes(option.id)
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-blue-100/50 bg-white/40 hover:border-blue-300/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-blue-900">{option.label}</p>
                    <p className="text-xs text-blue-600/60 font-light">{option.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    neurodivergencies.includes(option.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-blue-300'
                  }`}>
                    {neurodivergencies.includes(option.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sensory Preferences */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50 mb-8">
          <h2 className="text-2xl font-light text-blue-900 mb-6">Sensory Sensitivity Levels</h2>

          <div className="space-y-6">
            {/* Crowd Sensitivity */}
            <div>
              <label className="block text-blue-900 font-medium mb-3">Crowd Sensitivity</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setPreferences({...preferences, crowdSensitivity: level})}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Crowd Sensitivity: ${level}`)}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                      preferences.crowdSensitivity === level
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-blue-200 bg-white/50 text-blue-700 hover:border-blue-400'
                    }`}
                  >
                    <span className="font-light capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Sensitivity */}
            <div>
              <label className="block text-blue-900 font-medium mb-3">Sound Sensitivity</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setPreferences({...preferences, soundSensitivity: level})}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Sound Sensitivity: ${level}`)}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                      preferences.soundSensitivity === level
                        ? 'border-purple-500 bg-purple-500 text-white'
                        : 'border-purple-200 bg-white/50 text-purple-700 hover:border-purple-400'
                    }`}
                  >
                    <span className="font-light capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Light Sensitivity */}
            <div>
              <label className="block text-blue-900 font-medium mb-3">Light Sensitivity</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setPreferences({...preferences, lightSensitivity: level})}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Light Sensitivity: ${level}`)}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                      preferences.lightSensitivity === level
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-green-200 bg-white/50 text-green-700 hover:border-green-400'
                    }`}
                  >
                    <span className="font-light capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Touch Avoidance */}
            <div>
              <label className="block text-blue-900 font-medium mb-3">Touch Avoidance</label>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setPreferences({...preferences, touchAvoidance: level})}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Touch Avoidance: ${level}`)}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-300 ${
                      preferences.touchAvoidance === level
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-orange-200 bg-white/50 text-orange-700 hover:border-orange-400'
                    }`}
                  >
                    <span className="font-light capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSavePreferences}
            onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Save Preferences. Click to save your settings')}
            onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-light text-lg tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            <span className="relative">Save Preferences</span>
          </button>
          <Link
            href="/profile"
            onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('View Profile. Click to see your profile page')}
            onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            className="flex-1 px-8 py-4 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light text-lg tracking-wide border border-blue-200 hover:bg-blue-50 transition-all duration-500 hover:shadow-xl hover:scale-105 active:scale-95 text-center"
          >
            View Profile
          </Link>
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in">
            <p className="text-green-700 font-light">Preferences saved successfully!</p>
          </div>
        )}
      </main>

      <VoiceGuidanceToggle />

      <style jsx>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(40px, -60px) rotate(3deg); }
          66% { transform: translate(-30px, 30px) rotate(-3deg); }
        }
        @keyframes drift-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-50px, 40px) rotate(-4deg); }
          66% { transform: translate(40px, -40px) rotate(4deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-drift {
          animation: drift 20s ease-in-out infinite;
        }
        .animate-drift-delayed {
          animation: drift-delayed 18s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
