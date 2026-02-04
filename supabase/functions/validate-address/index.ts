import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface ValidateAddressRequest {
  address: string
  placeId?: string
}

interface ValidationResult {
  isValid: boolean
  formattedAddress?: string
  lat?: number
  lng?: number
  components?: {
    street: string
    houseNumber: string
    postalCode: string
    city: string
    country: string
  }
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Authentication check - require valid user session
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ isValid: false, error: 'Authentifizierung erforderlich' }),
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
        JSON.stringify({ isValid: false, error: 'Ungültige Authentifizierung' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured')
    }

    const { address, placeId }: ValidateAddressRequest = await req.json()

    if (!address && !placeId) {
      return new Response(
        JSON.stringify({ isValid: false, error: 'Adresse oder Place ID erforderlich' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let geocodeUrl: string
    
    if (placeId) {
      // Validate by Place ID (more accurate)
      geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${encodeURIComponent(placeId)}&key=${apiKey}&language=de`
    } else {
      // Validate by address string
      geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=de&components=country:DE|country:AT|country:CH`
    }

    const response = await fetch(geocodeUrl)
    const data = await response.json()

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          error: 'Adresse konnte nicht verifiziert werden. Bitte überprüfen Sie die Eingabe.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = data.results[0]
    const location = result.geometry.location
    
    // Parse address components
    const getComponent = (type: string): string => {
      const component = result.address_components?.find((c: { types: string[] }) => 
        c.types.includes(type)
      )
      return component?.long_name || ''
    }

    // Check if it's a valid street address (not just city or region)
    const streetNumber = getComponent('street_number')
    const street = getComponent('route')
    
    if (!street) {
      return new Response(
        JSON.stringify({ 
          isValid: false, 
          error: 'Bitte geben Sie eine vollständige Straßenadresse ein.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const validationResult: ValidationResult = {
      isValid: true,
      formattedAddress: result.formatted_address,
      lat: location.lat,
      lng: location.lng,
      components: {
        street,
        houseNumber: streetNumber,
        postalCode: getComponent('postal_code'),
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        country: getComponent('country'),
      }
    }

    return new Response(
      JSON.stringify(validationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Address validation error:', error)
    return new Response(
      JSON.stringify({ 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Validierungsfehler' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
