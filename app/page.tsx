'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VoiceGuidanceToggle from './components/VoiceGuidanceToggle'
import AccessibleButton from './components/AccessibleButton'
import AnxietySupport from './components/AnxietySupport'
import CompassAnimation from './components/CompassAnimation'
import { useAccessibility } from './context/AccessibilityContext'
import { speakOnHover, stopHoverSpeech } from './utils/accessibility'

const taglines = [
  "Let's navigate your day",
  "Your journey, your way",
  "Making the world more accessible",
  "Navigate with confidence",
  "Empowering your path forward",
  "Tools built for you",
  "Your compass, your control",
  "Designed around your needs",
  "Navigating life, together",
  "Your personalized guide"
]

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [showCompassAnimation, setShowCompassAnimation] = useState(true)
  const [showAnxietySupport, setShowAnxietySupport] = useState(false)
  const [hasAnxiety, setHasAnxiety] = useState(false)
  const [hasLearning, setHasLearning] = useState(false)
  const [hasAutism, setHasAutism] = useState(false)
  const [hasSpeech, setHasSpeech] = useState(false)
  const [tagline] = useState(() => taglines[Math.floor(Math.random() * taglines.length)])
  const [preferences, setPreferences] = useState({
    crowdSensitivity: 'medium',
    soundSensitivity: 'medium',
    lightSensitivity: 'medium',
    touchAvoidance: 'medium'
  })
  const { isVoiceGuidanceEnabled } = useAccessibility()

  useEffect(() => {
    if (user) {
      // Check if user has saved preferences
      fetch(`/api/preferences?userId=${encodeURIComponent(user.sub)}`)
        .then(res => res.json())
        .then(data => {
          if (!data || !data.user_id) {
            // First time user - redirect to preferences
            router.push('/preferences')
          } else {
            // Save preferences for anxiety support
            setPreferences({
              crowdSensitivity: data.crowd_sensitivity || 'medium',
              soundSensitivity: data.sound_sensitivity || 'medium',
              lightSensitivity: data.light_sensitivity || 'medium',
              touchAvoidance: data.touch_avoidance || 'medium'
            })

            // Check if user has learning disabilities selected
            if (data.neurodivergencies && data.neurodivergencies.includes('learning')) {
              setHasLearning(true)
            }

            // Check if user has anxiety selected
            if (data.neurodivergencies && data.neurodivergencies.includes('anxiety')) {
              setHasAnxiety(true)
            }

            // Check if user has autism selected
            if (data.neurodivergencies && data.neurodivergencies.includes('autism')) {
              setHasAutism(true)
            }

            // Check if user has speech impediment selected
            if (data.neurodivergencies && data.neurodivergencies.includes('speech')) {
              setHasSpeech(true)
            }
          }
        })
        .catch(err => {
          console.error('Error checking preferences:', err)
          router.push('/preferences')
        })
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin-slow"></div>
            <div className="absolute inset-2 border-4 border-blue-400 rounded-full border-b-transparent animate-spin-reverse"></div>
          </div>
          <p className="text-2xl text-blue-600 font-light tracking-wide animate-pulse-text">Loading your experience...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <>
        {showCompassAnimation && (
          <CompassAnimation onComplete={() => setShowCompassAnimation(false)} />
        )}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-drift"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-drift-delayed"></div>
        </div>

        {/* Anxiety Support Modal */}
        {showAnxietySupport && (
          <AnxietySupport
            onClose={() => setShowAnxietySupport(false)}
            preferences={preferences}
          />
        )}


        <div className="container mx-auto px-4 py-8 relative z-10">
          <nav className="flex justify-between items-center mb-16 animate-slide-down">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Project Compass" className="w-12 h-12" />
              <span className="text-xl font-display font-semibold text-blue-900 hidden sm:block">Project Compass</span>
            </div>
            <AccessibleButton
              onClick={() => window.location.href = '/auth/logout'}
              className="px-8 py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light tracking-wide border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-2xl hover:scale-105 active:scale-95"
              label="Sign out"
            >
              Logout
            </AccessibleButton>
          </nav>

          <main className="max-w-6xl mx-auto">
            <div
              className="text-center mb-16 animate-fade-in-up cursor-pointer"
              onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Welcome back, ${user.name}`)}
              onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            >
              <h1 className="text-5xl md:text-6xl font-display font-semibold mb-4 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-gradient">
                  Welcome back, {user.name}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-600/70 font-normal tracking-normal">
                {tagline}
              </p>
            </div>

            {/* Tool Boxes - Only show when selected */}
            <div className={`grid gap-6 mb-16 ${(hasAnxiety && !hasLearning && !hasAutism && !hasSpeech) || (hasSpeech && !hasAnxiety && !hasLearning && !hasAutism) ? 'md:grid-cols-1 max-w-md mx-auto' : hasAutism ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
              {/* Anxiety Support Box */}
              {hasAnxiety && (
                <button
                  onClick={() => setShowAnxietySupport(true)}
                  onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Anxiety Support')}
                  onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                  className="group relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-600/10 hover:from-indigo-500/20 hover:to-purple-600/20 rounded-3xl p-8 border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-indigo-900">Anxiety Support</h3>
                  </div>
                </button>
              )}

              {/* Learning Disability Boxes */}
              {hasLearning && (
                <>
                  <button
                    onClick={() => router.push('/learning-hub/dyslexia')}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Dyslexia Support')}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-blue-900">Dyslexia Support</h3>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/learning-hub/dyscalculia')}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Dyscalculia Support')}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 rounded-3xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-purple-900">Dyscalculia Support</h3>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/learning-hub/dysgraphia')}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Dysgraphia Support')}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 rounded-3xl p-8 border-2 border-green-200 hover:border-green-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-green-900">Dysgraphia Support</h3>
                    </div>
                  </button>
                </>
              )}

              {/* Autism Support Boxes */}
              {hasAutism && (
                <>
                  <button
                    onClick={() => router.push('/crowd-analysis')}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Crowd Analysis')}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-teal-600/10 hover:from-cyan-500/20 hover:to-teal-600/20 rounded-3xl p-8 border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-cyan-900">Crowd Analysis</h3>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/crowd-map')}
                    onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Crowd Map')}
                    onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                    className="group relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-amber-600/10 hover:from-orange-500/20 hover:to-amber-600/20 rounded-3xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-orange-900">Crowd Map</h3>
                    </div>
                  </button>
                </>
              )}

              {/* Speech Impediment Support Box */}
              {hasSpeech && (
                <button
                  onClick={() => router.push('/speech-practice')}
                  onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Speech Practice')}
                  onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                  className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-teal-600/10 hover:from-green-500/20 hover:to-teal-600/20 rounded-3xl p-8 border-2 border-green-200 hover:border-green-400 transition-all duration-300 ease-smooth-out hover:shadow-2xl hover:-translate-y-1 text-left"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-green-900">Speech Practice</h3>
                  </div>
                </button>
              )}
            </div>

            <div className="text-center animate-fade-in-up animation-delay-800">
              <AccessibleButton
                onClick={() => router.push('/profile')}
                className="group inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-light text-lg tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden"
                label="View Profile"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative">View Your Profile</span>
                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-500 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </AccessibleButton>
            </div>
          </main>
        </div>

        <VoiceGuidanceToggle />
      </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-drift"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-drift-delayed"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-drift-slow"></div>
      </div>

      <svg className="absolute top-10 left-10 w-32 h-32 opacity-20" viewBox="0 0 100 100">
        <path d="M10 10 L90 10" stroke="url(#line-gradient-1)" strokeWidth="1" className="animate-draw-line"/>
        <path d="M90 10 L90 50" stroke="url(#line-gradient-1)" strokeWidth="1" className="animate-draw-line animation-delay-300"/>
        <circle cx="10" cy="10" r="2" fill="#3B82F6" className="animate-fade-dot"/>
        <circle cx="90" cy="50" r="2" fill="#3B82F6" className="animate-fade-dot animation-delay-600"/>
        <defs>
          <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
      </svg>

      <svg className="absolute bottom-20 right-10 w-40 h-40 opacity-20" viewBox="0 0 100 100">
        <path d="M90 10 L10 30" stroke="url(#line-gradient-2)" strokeWidth="1" className="animate-draw-line animation-delay-400"/>
        <path d="M10 30 L30 90" stroke="url(#line-gradient-2)" strokeWidth="1" className="animate-draw-line animation-delay-700"/>
        <circle cx="90" cy="10" r="2" fill="#3B82F6" className="animate-fade-dot animation-delay-400"/>
        <circle cx="30" cy="90" r="2" fill="#3B82F6" className="animate-fade-dot animation-delay-1000"/>
        <defs>
          <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
      </svg>

      <svg className="absolute top-1/3 right-1/4 w-24 h-24 opacity-15" viewBox="0 0 100 100">
        <path d="M50 10 L50 90" stroke="url(#line-gradient-3)" strokeWidth="1" className="animate-draw-line animation-delay-200"/>
        <path d="M10 50 L90 50" stroke="url(#line-gradient-3)" strokeWidth="1" className="animate-draw-line animation-delay-500"/>
        <circle cx="50" cy="50" r="3" fill="#3B82F6" className="animate-fade-dot animation-delay-800"/>
        <defs>
          <linearGradient id="line-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.7"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="relative max-w-2xl w-full">
        {/* Animated Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48 animate-logo-entrance">
            <img src="/logo.svg" alt="Project Compass Logo" className="w-full h-full" />
          </div>
        </div>

        <div className="text-center mb-12 animate-fade-in-up animation-delay-1200">
          <h1 className="text-6xl md:text-7xl font-display font-semibold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-gradient">
              Project Compass
            </span>
          </h1>
          <p className="text-xl text-blue-600/70 font-normal tracking-wide mb-2">
            Neurodivergent Navigation Assistant
          </p>
          <p className="text-blue-500/50 font-normal">
            Navigate the world on your terms
          </p>
        </div>

        <div className="flex justify-center mb-10 animate-fade-in-up animation-delay-200">
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-blue-300/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <svg className="w-8 h-8 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-xs text-blue-600/60 font-light">Smart Routes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-blue-300/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <svg className="w-8 h-8 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <p className="text-xs text-blue-600/60 font-light">Adaptive AI</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-blue-300/50 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                <svg className="w-8 h-8 text-blue-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-blue-600/60 font-light">Real-time</p>
            </div>
          </div>
        </div>

        <div className="text-center animate-fade-in-up animation-delay-600">
          <a
            href="/auth/login"
            className="group inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-light text-lg tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            <span className="relative">Get Started</span>
            <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-500 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="mt-8 text-blue-500/50 text-sm font-light tracking-wide">
            Secure authentication powered by Auth0
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes logo-entrance {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotate(10deg);
          }
          70% {
            transform: scale(0.95) rotate(-5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        .animate-logo-entrance {
          animation: logo-entrance 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
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
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(2deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-slow {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-line {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-dot {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-drift {
          animation: drift 20s ease-in-out infinite;
        }
        .animate-drift-delayed {
          animation: drift-delayed 18s ease-in-out infinite;
        }
        .animate-drift-slow {
          animation: drift-slow 25s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .animate-slide-down {
          animation: slide-down 0.8s ease-out forwards;
        }
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2s ease-out forwards;
        }
        .animate-draw-slow {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-slow 3s ease-out forwards;
        }
        .animate-draw-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw-line 2s ease-out forwards;
        }
        .animate-fade-dot {
          animation: fade-dot 0.8s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
