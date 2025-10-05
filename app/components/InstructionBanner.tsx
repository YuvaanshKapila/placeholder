'use client'

import { useState } from 'react'
import { speakOnHover, stopHoverSpeech } from '@/app/utils/accessibility'
import { useAccessibility } from '@/app/context/AccessibilityContext'

interface InstructionBannerProps {
  steps: string[]
  currentStep?: number
}

export default function InstructionBanner({ steps, currentStep = 0 }: InstructionBannerProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { isVoiceGuidanceEnabled } = useAccessibility()

  return (
    <div className="mb-4 sm:mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(isExpanded ? 'Hide instructions' : 'Show instructions')}
        onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all font-bold text-lg sm:text-xl shadow-lg flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span>Instructions</span>
        </span>
        <span className="text-sm font-medium">{isExpanded ? 'Hide' : 'Show'}</span>
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 shadow-md">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                  index === currentStep
                    ? 'bg-yellow-100 border-2 border-yellow-400 shadow-md scale-105'
                    : index < currentStep
                    ? 'bg-green-50 border-2 border-green-300 opacity-70'
                    : 'bg-white border-2 border-gray-200'
                }`}
                onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover(step)}
                onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${
                    index === currentStep
                      ? 'bg-yellow-400 text-yellow-900'
                      : index < currentStep
                      ? 'bg-green-400 text-green-900'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-base sm:text-lg ${index === currentStep ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                    {step}
                  </p>
                  {index === currentStep && (
                    <div className="mt-2 px-3 py-1 bg-yellow-200 rounded-lg inline-block">
                      <span className="font-bold text-sm sm:text-base text-yellow-900">CURRENT STEP</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => isVoiceGuidanceEnabled && speakOnHover(steps.join('. Next step: '))}
            onMouseEnter={() => isVoiceGuidanceEnabled && speakOnHover('Read all instructions aloud')}
            onMouseLeave={() => isVoiceGuidanceEnabled && stopHoverSpeech()}
            className="mt-4 w-full px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-bold text-base sm:text-lg shadow-md transition-all"
          >
            Read All Instructions Aloud
          </button>
        </div>
      )}
    </div>
  )
}
