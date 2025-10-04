'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [showLearningPopup, setShowLearningPopup] = useState(false)

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
            // Check if user has learning disabilities selected
            if (data.neurodivergencies && data.neurodivergencies.includes('learning')) {
              setShowLearningPopup(true)
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-drift"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-drift-delayed"></div>
        </div>

        {/* Learning Disabilities Popup */}
        {showLearningPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full border border-blue-200 shadow-2xl animate-fade-in-up animation-delay-200">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-light text-blue-900 mb-4 tracking-wide">
                  Learning Support Tools
                </h2>
                <p className="text-blue-600/70 font-light">
                  Choose which learning disability tool you'd like to use
                </p>
              </div>

              <div className="grid gap-6 mb-6">
                <button
                  onClick={() => router.push('/learning-hub/dyslexia')}
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 rounded-2xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-light text-blue-900 mb-2">Dyslexia Support</h3>
                      <p className="text-blue-600/70 text-sm font-light">Camera-based text-to-speech reader with adjustable fonts and reading speed</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/learning-hub/dyscalculia')}
                  className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 rounded-2xl p-6 border border-purple-200 hover:border-purple-400 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-light text-purple-900 mb-2">Dyscalculia Support</h3>
                      <p className="text-purple-600/70 text-sm font-light">Math problem solver with visual step-by-step solutions powered by AI</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/learning-hub/dysgraphia')}
                  className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 rounded-2xl p-6 border border-green-200 hover:border-green-400 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-light text-green-900 mb-2">Dysgraphia Support</h3>
                      <p className="text-green-600/70 text-sm font-light">Writing assistant with spell check, voice dictation, and visual word suggestions</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowLearningPopup(false)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-light tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 relative z-10">
          <nav className="flex justify-end items-center mb-16 animate-slide-down">
            <a
              href="/auth/logout"
              className="px-8 py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light tracking-wide border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-500 hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Logout
            </a>
          </nav>

          <main className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-6xl md:text-7xl font-extralight mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-gradient">
                  Welcome back, {user.name}
                </span>
              </h1>
              <p className="text-xl text-blue-600/60 font-light tracking-wide">
                Your personalized navigation experience awaits
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50 hover:border-blue-300/50 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up animation-delay-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mb-6 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  <h3 className="text-2xl font-light text-blue-900 mb-3 tracking-wide">Smart Routes</h3>
                  <p className="text-blue-600/70 font-light leading-relaxed">Intelligent pathfinding designed around your unique comfort preferences and sensory needs</p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50 hover:border-blue-300/50 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up animation-delay-400">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mb-6 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  <h3 className="text-2xl font-light text-blue-900 mb-3 tracking-wide">Adaptive AI</h3>
                  <p className="text-blue-600/70 font-light leading-relaxed">Machine learning that evolves with your patterns and creates truly personalized experiences</p>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50 hover:border-blue-300/50 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up animation-delay-600">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mb-6 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  <h3 className="text-2xl font-light text-blue-900 mb-3 tracking-wide">Real-time Adapt</h3>
                  <p className="text-blue-600/70 font-light leading-relaxed">Dynamic route adjustment based on live environmental data and your current state</p>
                </div>
              </div>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-800">
              <a
                href="/profile"
                className="group inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-light text-lg tracking-wide hover:from-blue-700 hover:to-blue-800 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative">View Your Profile</span>
                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-500 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </main>
        </div>
      </div>
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
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-extralight mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent animate-gradient">
              NeuroNav
            </span>
          </h1>
          <p className="text-xl text-blue-600/70 font-light tracking-wide mb-2">
            Neurodivergent Navigation Assistant
          </p>
          <p className="text-blue-500/50 font-light">
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
