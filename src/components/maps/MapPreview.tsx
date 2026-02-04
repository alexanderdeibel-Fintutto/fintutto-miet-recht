import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
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
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMap() {
      if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        setMapUrl(null)
        return
      }

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Show fallback for unauthenticated users
        setError(null)
        setMapUrl(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const heightNum = parseInt(height) || 300
        const width = Math.min(heightNum * 2, 600)
        
        const { data, error: fnError } = await supabase.functions.invoke('static-map', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: null,
        })

        // Since invoke doesn't support GET with query params well, 
        // we use a direct fetch with auth header
        const projectUrl = import.meta.env.VITE_SUPABASE_URL
        const response = await fetch(
          `${projectUrl}/functions/v1/static-map?lat=${lat}&lng=${lng}&width=${width}&height=${heightNum}&zoom=${zoom}`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Kartenfehler' }))
          throw new Error(errorData.error || 'Karte konnte nicht geladen werden')
        }

        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        setMapUrl(blobUrl)
      } catch (err) {
        console.error('Map fetch error:', err)
        setError(err instanceof Error ? err.message : 'Kartenfehler')
      } finally {
        setLoading(false)
      }
    }

    fetchMap()

    // Cleanup blob URL on unmount
    return () => {
      if (mapUrl) {
        URL.revokeObjectURL(mapUrl)
      }
    }
  }, [lat, lng, height, zoom])

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

  // Validate coordinates are numbers
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return (
      <div 
        className={cn(
          'flex flex-col items-center justify-center bg-muted rounded-lg gap-2',
          className
        )}
        style={{ height }}
      >
        <MapPin className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Ungültige Koordinaten</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted rounded-lg',
          className
        )}
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !mapUrl) {
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
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-lg overflow-hidden bg-muted', className)} style={{ height }}>
      <img
        src={mapUrl}
        alt={address || 'Kartenansicht'}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
