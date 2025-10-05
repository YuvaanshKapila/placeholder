// Accessibility utilities for neurodivergent users

// Create singleton audio manager per tab
class AudioManager {
  private audioCache: { [key: string]: HTMLAudioElement } = {}
  private currentlyPlaying: HTMLAudioElement | null = null
  private lastPlayedTime: { [key: string]: number } = {}
  private playedInSession: Set<string> = new Set()
  private readonly DEBOUNCE_DELAY = 2000
  private readonly SESSION_RESET_DELAY = 5000
  private cleanupInterval: number | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      // Cleanup when tab becomes hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopAll()
        }
      })

      // Cleanup when page unloads
      window.addEventListener('beforeunload', () => {
        this.stopAll()
      })

      // Session cleanup interval
      this.cleanupInterval = window.setInterval(() => {
        const now = Date.now()
        this.playedInSession.forEach(text => {
          if (this.lastPlayedTime[text] && (now - this.lastPlayedTime[text] > this.SESSION_RESET_DELAY)) {
            this.playedInSession.delete(text)
          }
        })
      }, 5000)
    }
  }

  stopAll() {
    if (this.currentlyPlaying && !this.currentlyPlaying.paused) {
      this.currentlyPlaying.pause()
      this.currentlyPlaying.currentTime = 0
      this.currentlyPlaying = null
    }
    Object.values(this.audioCache).forEach(audio => {
      if (!audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    })
  }

  async speak(text: string, forcePlay: boolean = false) {
    // Stop any currently playing audio
    this.stopAll()

    const now = Date.now()

    if (!forcePlay && this.playedInSession.has(text)) {
      if (this.lastPlayedTime[text] && (now - this.lastPlayedTime[text] < this.SESSION_RESET_DELAY)) {
        return
      }
    }

    if (!forcePlay && this.lastPlayedTime[text] && (now - this.lastPlayedTime[text] < this.DEBOUNCE_DELAY)) {
      return
    }

    this.lastPlayedTime[text] = now
    this.playedInSession.add(text)

    if (this.audioCache[text]) {
      this.currentlyPlaying = this.audioCache[text]
      this.currentlyPlaying.currentTime = 0
      this.currentlyPlaying.play().catch(err => console.error('Audio play error:', err))
      return
    }

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      this.audioCache[text] = audio
      this.currentlyPlaying = audio

      audio.play().catch(err => console.error('Audio play error:', err))
    } catch (error) {
      console.error('TTS error:', error)
    }
  }

  stop() {
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause()
      this.currentlyPlaying.currentTime = 0
    }
  }

  clearCache() {
    this.stopAll()
    Object.values(this.audioCache).forEach(audio => {
      URL.revokeObjectURL(audio.src)
    })
    this.audioCache = {}
    this.playedInSession.clear()
  }

  resetSession() {
    this.playedInSession.clear()
    this.lastPlayedTime = {}
  }

  destroy() {
    this.stopAll()
    this.clearCache()
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Singleton instance
let audioManager: AudioManager | null = null

function getAudioManager(): AudioManager {
  if (typeof window === 'undefined') {
    throw new Error('AudioManager can only be used in browser')
  }
  if (!audioManager) {
    audioManager = new AudioManager()
  }
  return audioManager
}

/**
 * Speak text using ElevenLabs TTS on hover/focus
 */
export async function speakOnHover(text: string, forcePlay: boolean = false) {
  if (typeof window === 'undefined') return
  const manager = getAudioManager()
  await manager.speak(text, forcePlay)
}

/**
 * Stop any currently playing hover audio
 */
export function stopHoverSpeech() {
  if (typeof window === 'undefined') return
  const manager = getAudioManager()
  manager.stop()
}

/**
 * Clear the audio cache (call on unmount)
 */
export function clearAudioCache() {
  if (typeof window === 'undefined') return
  const manager = getAudioManager()
  manager.clearCache()
}

/**
 * Reset session played items (call when user enables voice guidance)
 */
export function resetSessionPlayed() {
  if (typeof window === 'undefined') return
  const manager = getAudioManager()
  manager.resetSession()
}

/**
 * React hook for accessible buttons with TTS
 * Only speaks when voice guidance is enabled
 */
export function useAccessibleButton(label: string, isEnabled: boolean = false) {
  const handleMouseEnter = () => {
    if (isEnabled) speakOnHover(label)
  }
  const handleMouseLeave = () => {
    if (isEnabled) stopHoverSpeech()
  }
  const handleFocus = () => {
    if (isEnabled) speakOnHover(label)
  }
  const handleBlur = () => {
    if (isEnabled) stopHoverSpeech()
  }

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'aria-label': label,
    role: 'button',
    tabIndex: 0
  }
}
