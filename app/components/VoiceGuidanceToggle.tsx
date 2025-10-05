'use client'

import { useAccessibility } from '@/app/context/AccessibilityContext'
import { speakOnHover, resetSessionPlayed } from '@/app/utils/accessibility'

export default function VoiceGuidanceToggle() {
  const { isVoiceGuidanceEnabled, toggleVoiceGuidance } = useAccessibility()

  const handleToggle = () => {
    const wasEnabled = isVoiceGuidanceEnabled
    toggleVoiceGuidance()

    // Reset session when enabling to allow re-hearing instructions
    if (!wasEnabled) {
      resetSessionPlayed()
    }

    // Speak confirmation
    setTimeout(() => {
      if (!wasEnabled) {
        speakOnHover('Voice guidance is now enabled. Hover over any button to hear what it does.', true)
      } else {
        speakOnHover('Voice guidance is now disabled.', true)
      }
    }, 100)
  }

  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-110 ${
        isVoiceGuidanceEnabled
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-gray-600 text-white hover:bg-gray-700'
      }`}
      aria-label={isVoiceGuidanceEnabled ? 'Disable voice guidance' : 'Enable voice guidance'}
    >
      <span className="flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isVoiceGuidanceEnabled ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          )}
        </svg>
        <span>{isVoiceGuidanceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
      </span>
    </button>
  )
}
