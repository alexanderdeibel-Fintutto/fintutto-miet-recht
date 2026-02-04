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
  const { getStaticMapUrl, error } = useGoogleMaps()

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

  // Calculate dimensions based on height (assuming 2:1 aspect ratio for map)
  const heightNum = parseInt(height) || 300
  const width = Math.min(heightNum * 2, 600)

  const mapUrl = getStaticMapUrl(lat, lng, width, heightNum, zoom)

  return (
    <div className={cn('relative rounded-lg overflow-hidden bg-muted', className)} style={{ height }}>
      <img
        src={mapUrl}
        alt={address || 'Kartenansicht'}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          // Hide broken image and show fallback
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="flex flex-col items-center justify-center h-full gap-2">
                <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-sm text-muted-foreground">${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
              </div>
            `
          }
        }}
      />
      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted/50 opacity-0 transition-opacity" id="map-loading">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}
