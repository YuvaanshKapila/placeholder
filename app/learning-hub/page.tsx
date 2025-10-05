'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LearningHub() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [selectedDisability, setSelectedDisability] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-xl text-blue-600 font-light">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const tools = [
    {
      id: 'dyslexia',
      name: 'Dyslexia Support',
      description: 'Camera Text-to-Speech Reader',
      icon: '',
      color: 'from-blue-500 to-blue-600',
      href: '/learning-hub/dyslexia'
    },
    {
      id: 'dyscalculia',
      name: 'Dyscalculia Support',
      description: 'Visual Math Problem Solver',
      icon: '',
      color: 'from-purple-500 to-purple-600',
      href: '/learning-hub/dyscalculia'
    },
    {
      id: 'dysgraphia',
      name: 'Dysgraphia Support',
      description: 'Spell Check & Writing Assistant',
      icon: '',
      color: 'from-green-500 to-green-600',
      href: '/learning-hub/dysgraphia'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-drift"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-drift-delayed"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="text-2xl font-extralight tracking-widest text-blue-900 hover:text-blue-600 transition-colors">
          ← Back to Home
        </Link>
        <a
          href="/auth/logout"
          className="px-8 py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light tracking-wide border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-500"
        >
          Logout
        </a>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extralight mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learning Disabilities Support
            </span>
          </h1>
          <p className="text-xl text-blue-600/70 font-light">
            Choose the tool that helps you learn best
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50 hover:border-blue-300/50 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                </div>

                <h3 className="text-2xl font-light text-blue-900 mb-3 tracking-wide">
                  {tool.name}
                </h3>

                <p className="text-blue-600/70 font-light leading-relaxed">
                  {tool.description}
                </p>

                <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-500">
                  <span>Open Tool</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-blue-100/50">
          <h2 className="text-2xl font-light text-blue-900 mb-4">How These Tools Help</h2>
          <div className="space-y-4 text-blue-600/80">
            <div>
              <p className="font-medium">Dyslexia Tool:</p>
              <p className="font-light">Point your camera at any text and hear it read aloud with adjustable speed and highlighting</p>
            </div>
            <div>
              <p className="font-medium">Dyscalculia Tool:</p>
              <p className="font-light">Take a photo of math problems and get step-by-step visual solutions with diagrams</p>
            </div>
            <div>
              <p className="font-medium">Dysgraphia Tool:</p>
              <p className="font-light">Get spelling suggestions with visual aids and word prediction as you type</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(40px, -60px) rotate(3deg); }
          66% { transform: translate(-30px, 30px) rotate(-3deg); }
        }
        @keyframes drift-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-50px, 40px) rotate(-4deg); }
          66% { transform: translate(40px, -40px) rotate(4deg); }
        }
        .animate-drift {
          animation: drift 20s ease-in-out infinite;
        }
        .animate-drift-delayed {
          animation: drift-delayed 18s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
