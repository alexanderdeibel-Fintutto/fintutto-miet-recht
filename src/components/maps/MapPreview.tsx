/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'
import { Loader2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapPreviewProps {
  lat?: number
  lng?: number
  address?: string
  className?: string
  height?: string
  zoom?: number
}

export function MapPreview({
  lat,
  lng,
  address,
  className,
  height = '300px',
  zoom = 16,
}: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  
  const { isLoaded, error } = useGoogleMaps()

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !lat || !lng) return

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      })
      setIsMapReady(true)
    }

    // Update center and marker
    const position = { lat, lng }
    mapInstanceRef.current.setCenter(position)

    if (markerRef.current) {
      markerRef.current.setPosition(position)
    } else {
      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        animation: window.google.maps.Animation.DROP,
        title: address || 'Standort',
      })

      // Add info window
      if (address) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div class="p-2 font-sans"><strong>${address}</strong></div>`,
        })
        markerRef.current.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, markerRef.current)
        })
      }
    }
  }, [isLoaded, lat, lng, zoom, address])

  // Cleanup
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [])

  if (error) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg',
          className
        )}
        style={{ height }}
      >
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (!lat || !lng) {
    return (
      <div 
        className={cn(
          'flex flex-col items-center justify-center bg-muted rounded-lg gap-2',
          className
        )}
        style={{ height }}
      >
        <MapPin className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Wählen Sie eine Adresse um die Karte anzuzeigen
        </p>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)} style={{ height }}>
      {(!isLoaded || !isMapReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
