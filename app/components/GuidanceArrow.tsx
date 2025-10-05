'use client'

interface GuidanceArrowProps {
  targetId: string
  direction: 'up' | 'down' | 'left' | 'right'
  text: string
  delay?: number
}

export default function GuidanceArrow({ targetId, direction, text, delay = 0 }: GuidanceArrowProps) {
  const arrowStyles = {
    up: 'bottom-full mb-4',
    down: 'top-full mt-4',
    left: 'right-full mr-4',
    right: 'left-full ml-4'
  }

  const arrowIcons = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→'
  }

  const animations = {
    up: 'animate-bounce',
    down: 'animate-bounce',
    left: 'animate-bounce-x',
    right: 'animate-bounce-x'
  }

  return (
    <div
      className={`absolute ${arrowStyles[direction]} pointer-events-none z-40`}
      style={{
        animation: `fadeIn 0.5s ease-in-out ${delay}s both`
      }}
    >
      <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-lg border-2 border-yellow-600">
        {direction === 'left' && <span className={`text-3xl ${animations[direction]}`}>{arrowIcons[direction]}</span>}
        {direction === 'up' && <span className={`text-3xl ${animations[direction]}`}>{arrowIcons[direction]}</span>}
        <span className="font-bold whitespace-nowrap">{text}</span>
        {direction === 'right' && <span className={`text-3xl ${animations[direction]}`}>{arrowIcons[direction]}</span>}
        {direction === 'down' && <span className={`text-3xl ${animations[direction]}`}>{arrowIcons[direction]}</span>}
      </div>
    </div>
  )
}
