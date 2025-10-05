'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { locations, categories, getCurrentBusyStatus, getBusyStatusColor } from '../utils/crowd-map-data'
import type { Location } from '../types/crowd-map'
import CompassLoader from '../components/CompassLoader'

// Dynamically import map component (client-side only)
const CrowdMapView = dynamic(() => import('../components/CrowdMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-2xl">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CompassLoader size="lg" color="#3B82F6" />
        </div>
        <p className="text-gray-600 font-display font-semibold">Loading Map...</p>
      </div>
    </div>
  )
})

export default function CrowdMapPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [filteredLocations, setFilteredLocations] = useState(locations)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    let filtered = locations

    if (selectedCategory) {
      filtered = filtered.filter(loc => loc.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(query) ||
        loc.address.toLowerCase().includes(query) ||
        loc.category.toLowerCase().includes(query)
      )
    }

    setFilteredLocations(filtered)
  }, [searchQuery, selectedCategory])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const currentHour = new Date().getHours()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <nav className="flex justify-center items-center mb-4 sm:mb-8 relative">
        <Link
          href="/"
          className="absolute left-0 px-3 sm:px-6 py-2 sm:py-3 bg-white/60 backdrop-blur-md text-blue-700 rounded-full font-light border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm sm:text-base"
        >
          Back to Home
        </Link>
        <h1 className="text-xl sm:text-3xl font-display font-semibold text-blue-900">Crowd Map</h1>
      </nav>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Info Banner */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-200">
          <p className="text-sm sm:text-base text-gray-700 text-center font-normal">
            <span className="font-display font-semibold text-blue-900">Current time:</span> {currentHour > 12 ? currentHour - 12 : currentHour}:00 {currentHour >= 12 ? 'PM' : 'AM'} -
            <span className="ml-2">Green = Quiet, Yellow = Moderate, Red = Busy</span>
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-200">
          <h2 className="text-lg font-display font-semibold text-blue-900 mb-3">Filter by Type</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Places
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-200">
          <input
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-base"
          />
        </div>

        {/* Map and Location List */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Map */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-200" style={{ minHeight: '500px' }}>
            <h2 className="text-lg font-display font-semibold text-blue-900 mb-3">Interactive Map</h2>
            <div className="h-[450px]">
              <CrowdMapView
                locations={filteredLocations}
                onLocationClick={setSelectedLocation}
              />
            </div>
          </div>

          {/* Location List */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-blue-200 overflow-y-auto" style={{ maxHeight: '550px' }}>
            <h2 className="text-lg font-display font-semibold text-blue-900 mb-3">
              Locations ({filteredLocations.length})
            </h2>
            <div className="space-y-3">
              {filteredLocations.map(location => {
                const status = getCurrentBusyStatus(location)
                if (!status) return null

                const color = getBusyStatusColor(status.status)

                return (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location)}
                    className="w-full text-left p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: color }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-gray-900 mb-1">{location.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-sm font-medium capitalize" style={{ color }}>
                            {status.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({status.estimatedPeople} people)
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected Location Details */}
        {selectedLocation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-display font-semibold text-gray-900">{selectedLocation.name}</h2>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Close
                  </button>
                </div>

                <p className="text-gray-600 mb-4">{selectedLocation.address}</p>
                {selectedLocation.description && (
                  <p className="text-gray-700 mb-6">{selectedLocation.description}</p>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-display font-semibold text-gray-900">Busy Times Today</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {selectedLocation.busySchedule.filter(p => p.hour >= 7 && p.hour <= 22).map(period => {
                      const color = getBusyStatusColor(period.status)
                      const isCurrentHour = period.hour === currentHour

                      return (
                        <div
                          key={period.hour}
                          className={`p-2 rounded-lg text-center ${isCurrentHour ? 'ring-2 ring-gray-900' : ''}`}
                          style={{ backgroundColor: color + '20', borderColor: color }}
                        >
                          <div className="text-xs font-medium text-gray-700">
                            {period.hour > 12 ? period.hour - 12 : period.hour}{period.hour >= 12 ? 'P' : 'A'}
                          </div>
                          <div
                            className="w-full h-1 rounded-full mt-1"
                            style={{ backgroundColor: color }}
                          ></div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="w-4 h-4 rounded-full bg-green-500 mb-2"></div>
                      <div className="text-sm font-medium text-green-900">Quiet</div>
                      <div className="text-xs text-green-700">Few people</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div className="w-4 h-4 rounded-full bg-yellow-500 mb-2"></div>
                      <div className="text-sm font-medium text-yellow-900">Moderate</div>
                      <div className="text-xs text-yellow-700">Some people</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="w-4 h-4 rounded-full bg-red-500 mb-2"></div>
                      <div className="text-sm font-medium text-red-900">Busy</div>
                      <div className="text-xs text-red-700">Many people</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
