/// <reference types="@types/google.maps" />
import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    google: typeof google
    initGoogleMaps: () => void
  }
}

interface UseGoogleMapsOptions {
  apiKey?: string
}

interface PlacePrediction {
  description: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface PlaceDetails {
  formatted_address: string
  address_components: google.maps.GeocoderAddressComponent[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
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

let isScriptLoading = false
let isScriptLoaded = false
const loadCallbacks: (() => void)[] = []

export function useGoogleMaps(options: UseGoogleMapsOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(isScriptLoaded)
  const [error, setError] = useState<string | null>(null)
  const apiKey = options.apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (isScriptLoaded) {
      setIsLoaded(true)
      return
    }

    if (isScriptLoading) {
      loadCallbacks.push(() => setIsLoaded(true))
      return
    }

    if (!apiKey) {
      setError('Google Maps API Key nicht konfiguriert')
      return
    }

    isScriptLoading = true

    window.initGoogleMaps = () => {
      isScriptLoaded = true
      isScriptLoading = false
      setIsLoaded(true)
      loadCallbacks.forEach(cb => cb())
      loadCallbacks.length = 0
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&language=de`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setError('Google Maps konnte nicht geladen werden')
      isScriptLoading = false
    }

    document.head.appendChild(script)
  }, [apiKey])

  const getPlacePredictions = useCallback(
    async (input: string): Promise<PlacePrediction[]> => {
      if (!isLoaded || !window.google) return []

      return new Promise((resolve) => {
        const service = new window.google.maps.places.AutocompleteService()
        service.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: ['de', 'at', 'ch'] },
            types: ['address'],
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              resolve(predictions as PlacePrediction[])
            } else {
              resolve([])
            }
          }
        )
      })
    },
    [isLoaded]
  )

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<ParsedAddress | null> => {
      if (!isLoaded || !window.google) return null

      return new Promise((resolve) => {
        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        )
        service.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'address_components', 'geometry'],
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              const parsed = parseAddressComponents(place, placeId)
              resolve(parsed)
            } else {
              resolve(null)
            }
          }
        )
      })
    },
    [isLoaded]
  )

  return {
    isLoaded,
    error,
    getPlacePredictions,
    getPlaceDetails,
  }
}

function parseAddressComponents(place: google.maps.places.PlaceResult, placeId: string): ParsedAddress {
  const components = place.address_components || []
  
  const getComponent = (type: string): string => {
    const component = components.find(c => c.types.includes(type))
    return component?.long_name || ''
  }

  const location = place.geometry?.location

  return {
    street: getComponent('route'),
    houseNumber: getComponent('street_number'),
    postalCode: getComponent('postal_code'),
    city: getComponent('locality') || getComponent('administrative_area_level_2'),
    country: getComponent('country'),
    lat: location?.lat() ?? 0,
    lng: location?.lng() ?? 0,
    formattedAddress: place.formatted_address || '',
    placeId,
  }
}

export type { PlacePrediction, ParsedAddress }
