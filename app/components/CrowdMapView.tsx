'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Location } from '../types/crowd-map'
import { getCurrentBusyStatus, getBusyStatusColor } from '../utils/crowd-map-data'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

interface CrowdMapViewProps {
  locations: Location[]
  onLocationClick: (location: Location) => void
}

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component to update map bounds when locations change
function MapUpdater({ locations }: { locations: Location[] }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.lat, loc.lng] as [number, number])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [locations, map])

  return null
}

// Create custom marker based on busy status
function createCustomIcon(location: Location): L.DivIcon {
  const currentStatus = getCurrentBusyStatus(location)
  const color = getBusyStatusColor(currentStatus?.status || 'moderate')

  return L.divIcon({
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "></div>
        <div style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${color};
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38],
  })
}

export default function CrowdMapView({ locations, onLocationClick }: CrowdMapViewProps) {
  const center: [number, number] = [43.7843, -79.1874] // UTSC coordinates

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => {
        const currentStatus = getCurrentBusyStatus(location) || {
          status: 'moderate' as const,
          estimatedPeople: 0
        }

        return (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location)}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup()
              },
            }}
          >
            <Popup closeButton={false} className="custom-popup">
              <div className="text-center p-2 min-w-[180px]">
                <p className="font-display font-semibold text-base mb-1">
                  {location.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {location.category}
                </p>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: getBusyStatusColor(currentStatus.status) }}
                >
                  {currentStatus.status.toUpperCase()} - {currentStatus.estimatedPeople} people
                </p>
                <button
                  onClick={() => onLocationClick(location)}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })}

      <MapUpdater locations={locations} />
    </MapContainer>
  )
}
