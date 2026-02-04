import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface PlaceDetailsRequest {
  placeId: string
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ address: null, error: 'Authentifizierung erforderlich' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ address: null, error: 'Ungültige Authentifizierung' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured')
    }

    const { placeId }: PlaceDetailsRequest = await req.json()

    if (!placeId) {
      return new Response(
        JSON.stringify({ address: null, error: 'Place ID erforderlich' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Call Google Places Details API
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
    url.searchParams.set('place_id', placeId)
    url.searchParams.set('key', apiKey)
    url.searchParams.set('language', 'de')
    url.searchParams.set('fields', 'formatted_address,address_components,geometry')

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status !== 'OK' || !data.result) {
      console.error('Places Details API error:', data.status, data.error_message)
      return new Response(
        JSON.stringify({ address: null, error: 'Adressdetails konnten nicht geladen werden' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = data.result
    const components = result.address_components || []

    const getComponent = (type: string): string => {
      const component = components.find((c: any) => c.types.includes(type))
      return component?.long_name || ''
    }

    const location = result.geometry?.location

    const address: ParsedAddress = {
      street: getComponent('route'),
      houseNumber: getComponent('street_number'),
      postalCode: getComponent('postal_code'),
      city: getComponent('locality') || getComponent('administrative_area_level_2'),
      country: getComponent('country'),
      lat: location?.lat ?? 0,
      lng: location?.lng ?? 0,
      formattedAddress: result.formatted_address || '',
      placeId,
    }

    return new Response(
      JSON.stringify({ address }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Place details error:', error)
    return new Response(
      JSON.stringify({ address: null, error: 'Serverfehler' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
