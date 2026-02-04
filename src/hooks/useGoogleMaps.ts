import { useState, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface PlacePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface ParsedAddress {
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
  lat: number
  lng: number
  formattedAddress: string
  placeId: string
}

export function useGoogleMaps() {
  const [error, setError] = useState<string | null>(null)

  const getPlacePredictions = useCallback(
    async (input: string): Promise<PlacePrediction[]> => {
      if (!input || input.length < 3) return []

      try {
        const { data, error: fnError } = await supabase.functions.invoke('places-autocomplete', {
          body: { input },
        })

        if (fnError) {
          console.error('Autocomplete error:', fnError)
          setError('Adresssuche fehlgeschlagen')
          return []
        }

        if (data?.error) {
          // Don't show auth errors as they may be expected for unauthenticated users
          if (!data.error.includes('Authentifizierung')) {
            setError(data.error)
          }
          return []
        }

        setError(null)
        return data?.predictions || []
      } catch (err) {
        console.error('Autocomplete request failed:', err)
        setError('Verbindungsfehler')
        return []
      }
    },
    []
  )

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<ParsedAddress | null> => {
      if (!placeId) return null

      try {
        const { data, error: fnError } = await supabase.functions.invoke('places-details', {
          body: { placeId },
        })

        if (fnError) {
          console.error('Place details error:', fnError)
          setError('Adressdetails konnten nicht geladen werden')
          return null
        }

        if (data?.error) {
          setError(data.error)
          return null
        }

        setError(null)
        return data?.address || null
      } catch (err) {
        console.error('Place details request failed:', err)
        setError('Verbindungsfehler')
        return null
      }
    },
    []
  )

  const getStaticMapUrl = useCallback(
    (lat: number, lng: number, width = 600, height = 300, zoom = 16): string => {
      const projectUrl = import.meta.env.VITE_SUPABASE_URL
      return `${projectUrl}/functions/v1/static-map?lat=${lat}&lng=${lng}&width=${width}&height=${height}&zoom=${zoom}`
    },
    []
  )

  return {
    isLoaded: true, // Always "loaded" since we use backend APIs
    error,
    getPlacePredictions,
    getPlaceDetails,
    getStaticMapUrl,
  }
}

export type { PlacePrediction, ParsedAddress }
