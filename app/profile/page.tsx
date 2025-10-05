'use client'

import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import { speakOnHover, stopHoverSpeech } from '../utils/accessibility'
import VoiceGuidanceToggle from '../components/VoiceGuidanceToggle'

export default function Profile() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { isVoiceGuidanceEnabled } = useAccessibility()

  const [preferences, setPreferences] = useState({
    crowdSensitivity: 'medium',
    soundSensitivity: 'medium',
    lightSensitivity: 'medium',
    touchAvoidance: 'medium'
  })
  // COMMENTED OUT: AI summary states - too much API usage
  // const [preferenceSummary, setPreferenceSummary] = useState('')
  // const [loadingSummary, setLoadingSummary] = useState(false)

  useEffect(() => {
    if (user) {
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
            // COMMENTED OUT: Generate AI summary of preferences - too much API usage
            // generatePreferenceSummary(data)
          }
        })
        .catch(err => console.error('Error loading preferences:', err))
    }
  }, [user])

  // COMMENTED OUT: AI summary generation - too much API usage
  // const generatePreferenceSummary = async (data: any) => {
  //   setLoadingSummary(true)
  //   try {
  //     const response = await fetch('/api/summarize-preferences', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         crowdSensitivity: data.crowd_sensitivity || 'medium',
  //         soundSensitivity: data.sound_sensitivity || 'medium',
  //         lightSensitivity: data.light_sensitivity || 'medium',
  //         touchAvoidance: data.touch_avoidance || 'medium',
  //         neurodivergencies: data.neurodivergencies || []
  //       })
  //     })
  //     const result = await response.json()
  //     setPreferenceSummary(result.summary || '')
  //   } catch (error) {
  //     console.error('Error generating summary:', error)
  //   } finally {
  //     setLoadingSummary(false)
  //   }
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ← Back to Home
              </span>
            </Link>
            <a
              href="/auth/logout"
              className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="mb-8 cursor-pointer"
          onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Your Profile')}
          onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Your Profile
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div
              className="bg-white rounded-lg shadow p-6 border border-gray-200 text-center cursor-pointer"
              onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`${user.name}, ${user.email}, Authenticated`)}
              onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            >
              <img
                src={user.picture || '/default-avatar.png'}
                alt={user.name || 'Profile'}
                className="w-24 h-24 rounded-full border-2 border-gray-300 mx-auto mb-4"
              />

              <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>

              <div className="px-4 py-2 bg-gray-100 rounded">
                <p className="text-xs text-gray-500">Authenticated</p>
                <p className="text-sm font-semibold text-gray-700">Yes</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div
              className="bg-white rounded-lg shadow p-6 border border-gray-200 cursor-pointer"
              onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Account Information. Full Name: ${user.name}. Email Address: ${user.email}`)}
              onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Full Name</span>
                  <span className="text-gray-900 font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email Address</span>
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">User ID</span>
                  <span className="text-gray-900 font-mono text-sm">{user.sub || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
              onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(`Sensory Preferences. Crowd Sensitivity: ${preferences.crowdSensitivity}. Sound Sensitivity: ${preferences.soundSensitivity}. Light Sensitivity: ${preferences.lightSensitivity}. Touch Avoidance: ${preferences.touchAvoidance}.`)}
              onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sensory Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded cursor-pointer">
                  <p className="text-sm text-gray-600 mb-1">Crowd Sensitivity</p>
                  <p className="text-base font-bold text-blue-600 capitalize">{preferences.crowdSensitivity}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded cursor-pointer">
                  <p className="text-sm text-gray-600 mb-1">Sound Sensitivity</p>
                  <p className="text-base font-bold text-purple-600 capitalize">{preferences.soundSensitivity}</p>
                </div>
                <div className="p-3 bg-green-50 rounded cursor-pointer">
                  <p className="text-sm text-gray-600 mb-1">Light Sensitivity</p>
                  <p className="text-base font-bold text-green-600 capitalize">{preferences.lightSensitivity}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded cursor-pointer">
                  <p className="text-sm text-gray-600 mb-1">Touch Avoidance</p>
                  <p className="text-base font-bold text-orange-600 capitalize">{preferences.touchAvoidance}</p>
                </div>
              </div>

              {/* COMMENTED OUT: AI Summary - too much API usage */}
              {/* {loadingSummary ? (
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-600 animate-pulse">Generating AI summary...</p>
                </div>
              ) : preferenceSummary ? (
                <div
                  className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 cursor-pointer"
                  onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(preferenceSummary)}
                  onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-indigo-900 mb-1">AI Summary</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{preferenceSummary}</p>
                  </div>
                </div>
              ) : null} */}

              <Link
                href="/preferences"
                className="mt-4 block w-full px-6 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 text-center"
                onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Customize Preferences. Click to change your sensory preference settings')}
                onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
              >
                Customize Preferences
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Raw User Data</h3>
              <div className="bg-gray-50 rounded p-4 overflow-auto max-h-96">
                <pre className="text-xs text-gray-700 font-mono">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
      <VoiceGuidanceToggle />
    </div>
  )
}
