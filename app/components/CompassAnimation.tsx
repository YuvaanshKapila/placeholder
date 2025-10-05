'use client'

import { useEffect, useState } from 'react'

interface CompassAnimationProps {
  onComplete: () => void
}

export default function CompassAnimation({ onComplete }: CompassAnimationProps) {
  const [stage, setStage] = useState<'enter' | 'spin' | 'disperse' | 'complete'>('enter')

  useEffect(() => {
    // Stage 1: Compass enters and spins (0.8s)
    const enterTimer = setTimeout(() => {
      setStage('spin')
    }, 800)

    // Stage 2: Needle spins separately (0.5s)
    const spinTimer = setTimeout(() => {
      setStage('disperse')
    }, 1300)

    // Stage 3: Compass disperses (0.4s)
    const disperseTimer = setTimeout(() => {
      setStage('complete')
      onComplete()
    }, 1700)

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(spinTimer)
      clearTimeout(disperseTimer)
    }
  }, [onComplete])

  if (stage === 'complete') return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 z-50 flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Outer compass circle */}
        <svg
          className={`absolute inset-0 w-full h-full ${
            stage === 'enter' ? 'animate-compass-enter' :
            stage === 'spin' ? 'animate-compass-spin' :
            'animate-compass-disperse'
          }`}
          viewBox="0 0 200 200"
        >
          {/* Outer circle */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="#3B82F6" strokeWidth="6" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="#3B82F6" strokeWidth="3" />

          {/* Cardinal points */}
          <line x1="100" y1="10" x2="100" y2="0" stroke="#3B82F6" strokeWidth="5" />
          <line x1="100" y1="190" x2="100" y2="200" stroke="#3B82F6" strokeWidth="5" />
          <line x1="10" y1="100" x2="0" y2="100" stroke="#3B82F6" strokeWidth="5" />
          <line x1="190" y1="100" x2="200" y2="100" stroke="#3B82F6" strokeWidth="5" />

          {/* Diagonal lines */}
          <line x1="35" y1="35" x2="25" y2="25" stroke="#3B82F6" strokeWidth="3" />
          <line x1="165" y1="35" x2="175" y2="25" stroke="#3B82F6" strokeWidth="3" />
          <line x1="35" y1="165" x2="25" y2="175" stroke="#3B82F6" strokeWidth="3" />
          <line x1="165" y1="165" x2="175" y2="175" stroke="#3B82F6" strokeWidth="3" />

          {/* Cardinal letters */}
          <text x="100" y="25" textAnchor="middle" fill="#3B82F6" fontSize="28" fontWeight="600" fontFamily="'Space Grotesk', system-ui, sans-serif">N</text>
          <text x="175" y="108" textAnchor="middle" fill="#3B82F6" fontSize="28" fontWeight="600" fontFamily="'Space Grotesk', system-ui, sans-serif">E</text>
          <text x="100" y="185" textAnchor="middle" fill="#3B82F6" fontSize="28" fontWeight="600" fontFamily="'Space Grotesk', system-ui, sans-serif">S</text>
          <text x="25" y="108" textAnchor="middle" fill="#3B82F6" fontSize="28" fontWeight="600" fontFamily="'Space Grotesk', system-ui, sans-serif">W</text>
        </svg>

        {/* Compass needle - spins separately */}
        <svg
          className={`absolute inset-0 w-full h-full ${
            stage === 'enter' ? '' :
            stage === 'spin' ? 'animate-needle-spin' :
            'animate-needle-disperse'
          }`}
          viewBox="0 0 200 200"
        >
          {/* Needle */}
          <path d="M 100,40 L 110,100 L 100,160 L 90,100 Z" fill="#2563EB" />
          <path d="M 100,40 L 110,100 L 100,110 Z" fill="white" />

          {/* Center circle */}
          <circle cx="100" cy="100" r="15" fill="white" stroke="#2563EB" strokeWidth="3" />
        </svg>

        {/* Project Compass text */}
        <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap ${
          stage === 'disperse' ? 'animate-text-fade-out' : 'animate-text-fade-in'
        }`}>
          <p className="text-2xl font-display font-semibold text-blue-900">Project Compass</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes compass-enter {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-90deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes compass-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes needle-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(720deg);
          }
        }

        @keyframes compass-disperse {
          0% {
            opacity: 1;
            transform: scale(1) rotate(360deg);
            filter: blur(0px);
          }
          50% {
            opacity: 0.6;
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: scale(2.5) rotate(450deg);
            filter: blur(8px);
          }
        }

        @keyframes needle-disperse {
          0% {
            opacity: 1;
            transform: rotate(720deg);
            filter: blur(0px);
          }
          50% {
            opacity: 0.5;
            filter: blur(3px);
          }
          100% {
            opacity: 0;
            transform: rotate(900deg) scale(0.3);
            filter: blur(10px);
          }
        }

        @keyframes text-fade-in {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes text-fade-out {
          0% {
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            filter: blur(4px);
          }
        }

        .animate-compass-enter {
          animation: compass-enter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-compass-spin {
          animation: compass-spin 0.5s linear forwards;
        }

        .animate-needle-spin {
          animation: needle-spin 0.5s linear forwards;
        }

        .animate-compass-disperse {
          animation: compass-disperse 0.4s ease-in forwards;
        }

        .animate-needle-disperse {
          animation: needle-disperse 0.4s ease-in forwards;
        }

        .animate-text-fade-in {
          animation: text-fade-in 0.3s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animate-text-fade-out {
          animation: text-fade-out 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
