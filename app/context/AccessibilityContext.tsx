'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AccessibilityContextType {
  isVoiceGuidanceEnabled: boolean
  toggleVoiceGuidance: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  isVoiceGuidanceEnabled: false,
  toggleVoiceGuidance: () => {}
})

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isVoiceGuidanceEnabled, setIsVoiceGuidanceEnabled] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('voiceGuidanceEnabled')
    if (saved === 'true') {
      setIsVoiceGuidanceEnabled(true)
    }
  }, [])

  const toggleVoiceGuidance = () => {
    const newValue = !isVoiceGuidanceEnabled
    setIsVoiceGuidanceEnabled(newValue)
    localStorage.setItem('voiceGuidanceEnabled', String(newValue))
  }

  return (
    <AccessibilityContext.Provider value={{ isVoiceGuidanceEnabled, toggleVoiceGuidance }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(AccessibilityContext)
}
