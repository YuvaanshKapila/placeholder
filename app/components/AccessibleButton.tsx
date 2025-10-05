'use client'

import { useAccessibleButton } from '@/app/utils/accessibility'
import { useAccessibility } from '@/app/context/AccessibilityContext'
import { ReactNode } from 'react'

interface AccessibleButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  label: string
  type?: 'button' | 'submit' | 'reset'
}

export default function AccessibleButton({
  children,
  onClick,
  className = '',
  disabled = false,
  label,
  type = 'button'
}: AccessibleButtonProps) {
  const { isVoiceGuidanceEnabled } = useAccessibility()
  const accessibilityProps = useAccessibleButton(label, isVoiceGuidanceEnabled)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} relative transition-all duration-300 focus:ring-4 focus:ring-blue-300 focus:outline-none`}
      {...accessibilityProps}
    >
      {children}
    </button>
  )
}
