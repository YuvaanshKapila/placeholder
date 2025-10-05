'use client'

import { useState, useRef, useEffect } from 'react'

interface AnxietySupportProps {
  onClose: () => void
  preferences: {
    crowdSensitivity: string
    soundSensitivity: string
    lightSensitivity: string
    touchAvoidance: string
  }
}

export default function AnxietySupport({ onClose, preferences }: AnxietySupportProps) {
  const [currentStep, setCurrentStep] = useState<'mood' | 'menu' | 'technique' | 'video' | 'journal' | 'practice'>('mood')
  const [moodLevel, setMoodLevel] = useState(5)
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [personalizedMessage, setPersonalizedMessage] = useState('')
  const [journalEntry, setJournalEntry] = useState('')
  const [savedEntries, setSavedEntries] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)

  // Level-specific recommendations
  const getLevelRecommendations = (level: number) => {
    const recommendations = {
      1: { // Panic
        primary: 'grounding',
        secondary: 'box',
        message: 'Right now, focus on grounding yourself in the present moment.',
        techniques: ['5-4-3-2-1 Grounding', 'Box Breathing'],
        practices: ['Immediate grounding exercises', 'Emergency calming techniques']
      },
      2: { // Very Anxious
        primary: '478',
        secondary: 'grounding',
        message: 'Let\'s work on bringing your anxiety down with some breathing.',
        techniques: ['4-7-8 Breathing', '5-4-3-2-1 Grounding', 'Box Breathing'],
        practices: ['Breathing exercises', 'Grounding techniques']
      },
      3: { // Anxious
        primary: 'body-scan',
        secondary: 'visualization',
        message: 'You\'re managing well. Let\'s help you feel even calmer.',
        techniques: ['Body Scan Relaxation', 'Safe Place Visualization', '4-7-8 Breathing'],
        practices: ['Progressive relaxation', 'Visualization exercises']
      },
      4: { // Uneasy
        primary: 'affirmations',
        secondary: 'visualization',
        message: 'This is a good time to practice prevention techniques.',
        techniques: ['Positive Affirmations', 'Safe Place Visualization'],
        practices: ['Positive self-talk', 'Preventive techniques']
      },
      5: { // Calm
        primary: 'visualization',
        secondary: 'affirmations',
        message: 'Great! Let\'s build resilience for future moments.',
        techniques: ['Safe Place Visualization', 'Positive Affirmations'],
        practices: ['Resilience building', 'Mindfulness practice']
      }
    }
    return recommendations[level as keyof typeof recommendations]
  }

  const generalAnxietyPrompts = {
    1: [ // Panic
      'Name 5 things you can see right now',
      'Feel your feet on the ground',
      'This feeling will pass, you are safe',
      'Focus only on this breath'
    ],
    2: [ // Very Anxious
      'What is one thing you can control right now?',
      'Where do you feel the anxiety in your body?',
      'What would you tell a friend feeling this way?',
      'What has helped you calm down before?'
    ],
    3: [ // Anxious
      'What triggered this anxious feeling?',
      'What is the worst that could realistically happen?',
      'What evidence do I have for/against this worry?',
      'How can I take care of myself right now?'
    ],
    4: [ // Uneasy
      'What am I worried might happen?',
      'What would help me feel more prepared?',
      'What positive things happened today?',
      'What am I grateful for right now?'
    ],
    5: [ // Calm
      'What strategies helped me stay calm today?',
      'What can I do to maintain this feeling?',
      'What have I learned about my anxiety triggers?',
      'What are my strengths in managing anxiety?'
    ]
  }

  const socialAnxietyPrompts = {
    1: [ // Panic (in social situation)
      'I need to excuse myself and that\'s okay',
      'Focus on my breathing, not others\' eyes',
      'I can leave if I need to',
      'This panic will pass'
    ],
    2: [ // Very Anxious
      'What am I afraid others will think?',
      'Is this thought based on facts or feelings?',
      'People are focused on themselves, not judging me',
      'What would I think if I saw someone else like this?'
    ],
    3: [ // Anxious
      'What social situations feel manageable?',
      'Who are safe people I can be around?',
      'What went well in my last social interaction?',
      'How can I prepare for upcoming social events?'
    ],
    4: [ // Uneasy
      'What small social step can I take today?',
      'How can I reward myself for trying?',
      'What conversation topics feel comfortable?',
      'Who makes me feel most at ease?'
    ],
    5: [ // Calm
      'What social victories did I have this week?',
      'How did I challenge my social anxiety today?',
      'What social situations am I getting better at?',
      'How can I maintain this confidence?'
    ]
  }

  const techniques = [
    {
      id: '478',
      name: '4-7-8 Breathing',
      description: 'Breathe in for 4, hold for 7, out for 8',
      duration: 60,
      recommendedFor: [2, 3],
      script: 'Let\'s practice the 4-7-8 breathing technique together. This will help calm your nervous system. Get comfortable and let\'s begin. Breathe in slowly through your nose for 4 counts... 1... 2... 3... 4. Now hold your breath for 7 counts... 1... 2... 3... 4... 5... 6... 7. Slowly breathe out through your mouth for 8 counts... 1... 2... 3... 4... 5... 6... 7... 8. Excellent. Let\'s do this two more times. Breathe in for 4... 1... 2... 3... 4. Hold for 7... 1... 2... 3... 4... 5... 6... 7. Out for 8... 1... 2... 3... 4... 5... 6... 7... 8. One more time. In for 4... 1... 2... 3... 4. Hold for 7... 1... 2... 3... 4... 5... 6... 7. Out for 8... 1... 2... 3... 4... 5... 6... 7... 8. Beautiful. You\'re doing great. Notice how your body feels more relaxed now.'
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'Breathe in 4, hold 4, out 4, hold 4',
      duration: 60,
      recommendedFor: [1, 2],
      script: 'Welcome to box breathing. This technique is used by Navy SEALs to stay calm under pressure. Sit comfortably and let\'s begin. Breathe in for 4 counts... 1... 2... 3... 4. Hold your breath for 4 counts... 1... 2... 3... 4. Breathe out for 4 counts... 1... 2... 3... 4. Hold empty for 4 counts... 1... 2... 3... 4. Great job. Let\'s repeat. In for 4... 1... 2... 3... 4. Hold for 4... 1... 2... 3... 4. Out for 4... 1... 2... 3... 4. Hold for 4... 1... 2... 3... 4. One more round. In... 1... 2... 3... 4. Hold... 1... 2... 3... 4. Out... 1... 2... 3... 4. Hold... 1... 2... 3... 4. Perfect. You\'re in control.'
    },
    {
      id: 'grounding',
      name: '5-4-3-2-1 Grounding',
      description: 'Use your senses to ground yourself',
      duration: 90,
      recommendedFor: [1, 2],
      script: 'Let\'s practice the 5-4-3-2-1 grounding technique. This helps bring you back to the present moment. Take a deep breath. Now, look around and name 5 things you can see. It could be a chair, a wall, your hands, anything. Take your time... Good. Now, name 4 things you can touch or feel. Maybe the floor beneath your feet, your clothing, the air on your skin. Notice the textures... Excellent. Now, 3 things you can hear. Listen carefully. Maybe you hear your own breathing, distant sounds, or silence itself... Well done. Now, 2 things you can smell. If you can\'t smell anything right now, think of 2 scents you enjoy... Almost there. Finally, 1 thing you can taste. Maybe the taste in your mouth, or imagine your favorite flavor... Perfect. Notice how you feel more present and grounded now. You\'re here. You\'re safe. You\'re okay.'
    },
    {
      id: 'body-scan',
      name: 'Body Scan Relaxation',
      description: 'Progressive muscle relaxation',
      duration: 120,
      recommendedFor: [3, 4],
      script: 'Welcome to the body scan relaxation. Find a comfortable position and close your eyes if that feels okay. Take three deep breaths... Good. Now, bring your attention to your feet. Notice any tension there. Gently wiggle your toes, then let them relax completely... Now move to your calves and legs. Tense them for a moment, then release. Feel the tension flowing away... Move your awareness to your hips and lower back. Breathe into any tightness, then let it go... Notice your stomach and chest. With each breath, feel them soften and relax... Bring attention to your hands. Make fists, hold for three seconds, then release. Feel your fingers completely relaxed... Move to your shoulders. Lift them toward your ears, hold, then drop them down. Feel the relief... Notice your neck and jaw. Many of us hold tension here. Gently move your head side to side, then relax your jaw... Finally, your face. Scrunch up your face, hold, then release everything. Feel your forehead smooth, your eyes soft... Take three more deep breaths. Notice how relaxed your body feels. When you\'re ready, slowly open your eyes. You\'ve done wonderfully.'
    },
    {
      id: 'visualization',
      name: 'Safe Place Visualization',
      description: 'Imagine your peaceful sanctuary',
      duration: 90,
      recommendedFor: [3, 4, 5],
      script: 'Close your eyes and take three deep, calming breaths. Now, imagine a place where you feel completely safe and at peace. This could be a real place you\'ve been, or somewhere completely from your imagination. It might be a beach, a forest, a cozy room, anywhere that feels safe to you... Notice what you see in this place. The colors, the light, the details around you... What do you hear? Maybe gentle sounds of nature, or peaceful silence... What can you feel? Perhaps a gentle breeze, warm sunshine, or soft textures... Notice the temperature. Is it warm and comfortable? Cool and refreshing? Just right... What scents are in the air? Fresh air, flowers, the ocean?... This is your safe place. You can come here anytime you need to feel calm and protected. Spend a few more moments here, soaking in the peaceful feeling... When you\'re ready, take a deep breath, and slowly open your eyes. Remember, this place is always here for you.'
    },
    {
      id: 'affirmations',
      name: 'Positive Affirmations',
      description: 'Calming self-talk and reassurance',
      duration: 75,
      recommendedFor: [4, 5],
      script: 'Let\'s practice some positive affirmations together. These words can help calm your mind and remind you of your strength. Take a deep breath, and repeat these phrases in your mind or out loud... I am safe right now... I am capable of handling this moment... This feeling will pass... I have overcome difficult moments before... I am stronger than my anxiety... My feelings are valid, and it\'s okay to feel this way... I am doing the best I can, and that is enough... With each breath, I am becoming calmer... I choose peace over worry... I am in control of my thoughts and actions... I am worthy of peace and happiness... This anxiety does not define me... I trust in my ability to get through this... Take three more deep breaths, and notice how you feel. You are doing wonderfully.'
    }
  ]

  const quickTips = [
    {
      id: 'cold-water',
      title: 'Cold Water Technique',
      tip: 'Splash cold water on your face or hold ice cubes. This triggers the dive reflex, naturally calming your nervous system.',
      icon: '',
      forLevels: [1, 2]
    },
    {
      id: 'movement',
      title: 'Gentle Movement',
      tip: 'Walk slowly, stretch, or do gentle yoga. Physical movement helps release anxious energy and ground you in your body.',
      icon: '',
      forLevels: [2, 3, 4]
    },
    {
      id: 'humming',
      title: 'Humming or Singing',
      tip: 'Hum a tune or sing quietly. The vibrations stimulate the vagus nerve, which helps calm your nervous system.',
      icon: '',
      forLevels: [3, 4, 5]
    },
    {
      id: 'count',
      title: 'Counting Objects',
      tip: 'Count objects around you - tiles, books, anything. This redirects your mind from anxious thoughts to the present.',
      icon: '',
      forLevels: [1, 2, 3]
    }
  ]

  useEffect(() => {
    if (currentStep === 'mood') {
      generatePersonalizedMessage()
    }
  }, [currentStep, moodLevel])

  const generatePersonalizedMessage = async () => {
    try {
      const response = await fetch('/api/anxiety-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodLevel,
          preferences
        })
      })
      const data = await response.json()
      setPersonalizedMessage(data.message || '')
    } catch (error) {
      console.error('Error generating message:', error)
    }
  }

  const playTechnique = async () => {
    if (!selectedTechnique) return

    setIsPlaying(true)
    setCurrentStep('video')

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedTechnique.script })
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()

        audioRef.current.onended = () => {
          setIsPlaying(false)
        }
      }
    } catch (error) {
      console.error('TTS error:', error)
      setIsPlaying(false)
    }
  }

  const stopTechnique = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      setSavedEntries([...savedEntries, journalEntry])
      setJournalEntry('')
      alert('Journal entry saved! (Note: Entries are only saved for this session)')
    }
  }

  const moods = [
    { level: 1, emoji: '', label: 'Panic', color: 'bg-red-500' },
    { level: 2, emoji: '', label: 'Very Anxious', color: 'bg-orange-500' },
    { level: 3, emoji: '', label: 'Anxious', color: 'bg-yellow-500' },
    { level: 4, emoji: '', label: 'Uneasy', color: 'bg-blue-400' },
    { level: 5, emoji: '', label: 'Calm', color: 'bg-green-400' },
  ]

  const levelRecs = getLevelRecommendations(moodLevel)
  const recommendedTechniques = techniques.filter(t => t.recommendedFor.includes(moodLevel))
  const relevantTips = quickTips.filter(t => t.forLevels.includes(moodLevel))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <audio ref={audioRef} className="hidden" />

      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Anxiety Support Center</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Mood Check */}
          {currentStep === 'mood' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">How are you feeling right now?</h3>
                <p className="text-gray-600">Your feelings are valid. Let&apos;s work through this together.</p>
              </div>

              <div className="flex justify-center gap-4">
                {moods.map((mood) => (
                  <button
                    key={mood.level}
                    onClick={() => setMoodLevel(mood.level)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      moodLevel === mood.level
                        ? `${mood.color} border-gray-800 scale-110`
                        : 'border-gray-300 hover:scale-105'
                    }`}
                  >
                    <div className="text-lg font-bold text-gray-900 mb-2">{mood.label}</div>
                  </button>
                ))}
              </div>

              {personalizedMessage && (
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-indigo-900 leading-relaxed">{personalizedMessage}</p>
                </div>
              )}

              {/* Level-specific guidance */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">Recommended for you:</h4>
                <p className="text-purple-800 mb-3">{levelRecs.message}</p>
                <div className="flex flex-wrap gap-2">
                  {levelRecs.techniques.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('menu')}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Continue to Support Options
              </button>
            </div>
          )}

          {/* Step 2: Menu */}
          {currentStep === 'menu' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Support</h3>
                <p className="text-gray-600">What would help you most right now?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Only show breathing for levels 1-4 (not calm) */}
                {moodLevel <= 4 && recommendedTechniques.length > 0 && (
                  <button
                    onClick={() => setCurrentStep('technique')}
                    className="p-6 rounded-2xl border-2 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                  >
                    <h4 className="text-xl font-bold text-indigo-900 mb-2">Guided Breathing</h4>
                    <p className="text-gray-600 mb-2">Voice-guided calming techniques</p>
                    <p className="text-sm text-indigo-600">{recommendedTechniques.length} techniques for your level</p>
                  </button>
                )}

                {/* Show practice prompts for all levels */}
                <button
                  onClick={() => setCurrentStep('practice')}
                  className="p-6 rounded-2xl border-2 border-green-300 hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <h4 className="text-xl font-bold text-green-900 mb-2">
                    {moodLevel <= 2 ? 'Grounding Exercises' : moodLevel <= 4 ? 'Reflection Prompts' : 'Mindfulness Practice'}
                  </h4>
                  <p className="text-gray-600">
                    {moodLevel <= 2 ? 'Quick questions to ground yourself' : moodLevel <= 4 ? 'Work through your thoughts' : 'Build resilience and awareness'}
                  </p>
                </button>

                {/* Show journal for levels 2-5 (not panic) */}
                {moodLevel >= 2 && (
                  <button
                    onClick={() => setCurrentStep('journal')}
                    className="p-6 rounded-2xl border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                  >
                    <h4 className="text-xl font-bold text-purple-900 mb-2">Thought Journal</h4>
                    <p className="text-gray-600">Write down your thoughts and feelings</p>
                  </button>
                )}

                {/* Only show emergency resources for panic/very anxious */}
                {moodLevel <= 2 && (
                  <div className="p-6 rounded-2xl border-2 border-red-300 bg-red-50">
                    <h4 className="text-xl font-bold text-red-900 mb-2">Emergency Resources</h4>
                    <p className="text-sm text-red-700 mb-2">Crisis Hotline: 988</p>
                    <p className="text-sm text-red-700">Crisis Text Line: Text HOME to 741741</p>
                  </div>
                )}

                {/* Show visualization/mindfulness for calm levels */}
                {moodLevel >= 4 && (
                  <button
                    onClick={() => setCurrentStep('technique')}
                    className="p-6 rounded-2xl border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <h4 className="text-xl font-bold text-blue-900 mb-2">Mindfulness & Visualization</h4>
                    <p className="text-gray-600 mb-2">Build resilience and inner peace</p>
                    <p className="text-sm text-blue-600">{recommendedTechniques.length} practices available</p>
                  </button>
                )}
              </div>

              {relevantTips.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-bold text-indigo-900 mb-4">Quick Relief Tips for Your Level</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relevantTips.map(tip => (
                      <div key={tip.id} className="bg-white p-4 rounded-xl">
                        <div>
                          <h5 className="font-bold text-gray-900 mb-1">{tip.title}</h5>
                          <p className="text-sm text-gray-600">{tip.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setCurrentStep('mood')}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
              >
                Back
              </button>
            </div>
          )}

          {/* Step 3: Practice Prompts */}
          {currentStep === 'practice' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Practice Prompts</h3>
                <p className="text-gray-600">Work through these questions at your own pace</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* General Anxiety Prompts */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-xl font-bold text-blue-900 mb-4">General Anxiety</h4>
                  <div className="space-y-3">
                    {generalAnxietyPrompts[moodLevel as keyof typeof generalAnxietyPrompts].map((prompt, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl">
                        <p className="text-blue-900">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Anxiety Prompts */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                  <h4 className="text-xl font-bold text-purple-900 mb-4">Social Anxiety</h4>
                  <div className="space-y-3">
                    {socialAnxietyPrompts[moodLevel as keyof typeof socialAnxietyPrompts].map((prompt, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl">
                        <p className="text-purple-900">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-yellow-900 text-sm">
                  <strong>Tip:</strong> Take time with each question. Write your answers in the journal, talk them through out loud, or simply reflect.
                </p>
              </div>

              <button
                onClick={() => setCurrentStep('menu')}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
              >
                Back to Menu
              </button>
            </div>
          )}

          {/* Step 4: Choose Technique */}
          {currentStep === 'technique' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose a Calming Technique</h3>
                <p className="text-gray-600">Techniques recommended for your current state</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {recommendedTechniques.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => setSelectedTechnique(tech)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      selectedTechnique?.id === tech.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{tech.name}</h4>
                    <p className="text-gray-600 mb-2">{tech.description}</p>
                    <p className="text-sm text-indigo-600">{tech.duration} seconds</p>
                  </button>
                ))}
              </div>

              {/* Show all techniques option */}
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="cursor-pointer font-semibold text-gray-700">View all techniques</summary>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {techniques.filter(t => !t.recommendedFor.includes(moodLevel)).map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedTechnique?.id === tech.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300 hover:border-indigo-300'
                      }`}
                    >
                      <h5 className="font-bold text-gray-900 mb-1">{tech.name}</h5>
                      <p className="text-sm text-gray-600">{tech.description}</p>
                    </button>
                  ))}
                </div>
              </details>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('menu')}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={playTechnique}
                  disabled={!selectedTechnique}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Technique
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Video/Audio Playback */}
          {currentStep === 'video' && selectedTechnique && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-12 text-center">
                <h3 className="text-3xl font-bold text-indigo-900 mb-4">{selectedTechnique.name}</h3>
                <p className="text-lg text-indigo-700 mb-6">{selectedTechnique.description}</p>

                {isPlaying ? (
                  <div className="space-y-4">
                    <div className="text-indigo-600 font-medium">Listen and follow along...</div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-indigo-500/20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-block px-4 py-2 bg-green-500 text-white rounded-full font-semibold">
                      Complete
                    </div>
                    <p className="text-indigo-700">Take a moment to notice how you feel</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {isPlaying ? (
                  <button
                    onClick={stopTechnique}
                    className="flex-1 px-6 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all"
                  >
                    Stop
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentStep('menu')}
                      className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
                    >
                      Back to Menu
                    </button>
                    <button
                      onClick={playTechnique}
                      className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all"
                    >
                      Repeat
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Journal */}
          {currentStep === 'journal' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thought Journal</h3>
                <p className="text-gray-600">Writing can help process anxious thoughts</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-3">Prompts for your level:</h4>
                <ul className="space-y-2 text-purple-800">
                  {generalAnxietyPrompts[moodLevel as keyof typeof generalAnxietyPrompts].map((prompt, i) => (
                    <li key={i}>• {prompt}</li>
                  ))}
                </ul>
              </div>

              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full h-48 p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none resize-none"
              />

              <button
                onClick={saveJournalEntry}
                disabled={!journalEntry.trim()}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                Save Entry
              </button>

              {savedEntries.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-2">Today&apos;s Entries ({savedEntries.length})</h4>
                  <p className="text-sm text-gray-600">Your thoughts have been recorded for this session</p>
                </div>
              )}

              <button
                onClick={() => setCurrentStep('menu')}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
