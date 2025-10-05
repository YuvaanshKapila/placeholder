'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function GlobalLoader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  useEffect(() => {
    // Detect when pathname is about to change
    if (pathname !== prevPathname) {
      setIsLoading(true)
      setPrevPathname(pathname)

      // Keep showing loader during compilation
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname])

  // Show loader on any link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a, button')

      if (link) {
        const href = link.getAttribute('href')
        const onClick = link.getAttribute('onclick')

        // Check if it's a navigation element
        if (href && href !== '#' && !href.startsWith('http')) {
          setIsLoading(true)
        } else if (onClick || link.tagName === 'BUTTON') {
          // Check if button has router.push
          const buttonText = link.textContent?.toLowerCase() || ''
          if (buttonText.includes('support') || buttonText.includes('practice') ||
              buttonText.includes('crowd') || buttonText.includes('learning')) {
            setIsLoading(true)
          }
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 z-[9999] flex items-center justify-center">
      <div className="text-center">
        {/* Animated compass loader */}
        <div className="relative w-32 h-32 mb-6">
          <svg
            className="absolute inset-0 w-full h-full animate-spin-compass"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="#3B82F6" strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#60A5FA" strokeWidth="2" />
            <line x1="50" y1="5" x2="50" y2="0" stroke="#3B82F6" strokeWidth="3" />
            <line x1="50" y1="95" x2="50" y2="100" stroke="#3B82F6" strokeWidth="3" />
            <line x1="5" y1="50" x2="0" y2="50" stroke="#3B82F6" strokeWidth="3" />
            <line x1="95" y1="50" x2="100" y2="50" stroke="#3B82F6" strokeWidth="3" />
          </svg>

          <svg
            className="absolute inset-0 w-full h-full animate-spin-needle"
            viewBox="0 0 100 100"
          >
            <path d="M 50,20 L 55,50 L 50,80 L 45,50 Z" fill="#2563EB" />
            <path d="M 50,20 L 55,50 L 50,55 Z" fill="white" />
            <circle cx="50" cy="50" r="8" fill="white" stroke="#2563EB" strokeWidth="2" />
          </svg>
        </div>

        <p className="text-blue-600 font-display font-semibold text-xl animate-pulse">Loading...</p>
      </div>

      <style jsx>{`
        @keyframes spin-compass {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-needle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(720deg);
          }
        }

        .animate-spin-compass {
          animation: spin-compass 1.2s linear infinite;
        }

        .animate-spin-needle {
          animation: spin-needle 0.8s linear infinite;
        }
      `}</style>
    </div>
  )
}
