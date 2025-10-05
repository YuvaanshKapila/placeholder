'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CrowdAnalyzer from '../components/CrowdAnalyzer'

export default function CrowdAnalysisPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">← Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto px-4 py-8 max-w-none">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Crowd Analysis
          </h1>
          <p className="text-gray-600 text-lg">
            Check crowd size and noise levels
          </p>
        </div>

        <CrowdAnalyzer />
      </main>
    </div>
  )
}
