'use client'

interface CompassLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function CompassLoader({ size = 'md', color = '#3B82F6' }: CompassLoaderProps) {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  return (
    <div className={`relative ${dimensions[size]}`}>
      <svg
        className="absolute inset-0 w-full h-full animate-spin-compass"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="3" />
        <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
        <line x1="50" y1="5" x2="50" y2="0" stroke={color} strokeWidth="3" />
        <line x1="50" y1="95" x2="50" y2="100" stroke={color} strokeWidth="3" />
        <line x1="5" y1="50" x2="0" y2="50" stroke={color} strokeWidth="3" />
        <line x1="95" y1="50" x2="100" y2="50" stroke={color} strokeWidth="3" />
      </svg>

      <svg
        className="absolute inset-0 w-full h-full animate-spin-needle"
        viewBox="0 0 100 100"
      >
        <path d="M 50,20 L 55,50 L 50,80 L 45,50 Z" fill={color} />
        <path d="M 50,20 L 55,50 L 50,55 Z" fill="white" />
        <circle cx="50" cy="50" r="8" fill="white" stroke={color} strokeWidth="2" />
      </svg>

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
