import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured')
    }

    const url = new URL(req.url)
    const lat = url.searchParams.get('lat')
    const lng = url.searchParams.get('lng')
    const zoom = url.searchParams.get('zoom') || '16'
    const width = url.searchParams.get('width') || '600'
    const height = url.searchParams.get('height') || '300'

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'Koordinaten erforderlich' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate coordinates
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Koordinaten' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Build Static Maps URL
    const staticMapUrl = new URL('https://maps.googleapis.com/maps/api/staticmap')
    staticMapUrl.searchParams.set('center', `${lat},${lng}`)
    staticMapUrl.searchParams.set('zoom', zoom)
    staticMapUrl.searchParams.set('size', `${width}x${height}`)
    staticMapUrl.searchParams.set('scale', '2')
    staticMapUrl.searchParams.set('maptype', 'roadmap')
    staticMapUrl.searchParams.set('markers', `color:red|${lat},${lng}`)
    staticMapUrl.searchParams.set('key', apiKey)

    // Fetch the image from Google
    const imageResponse = await fetch(staticMapUrl.toString())
    
    if (!imageResponse.ok) {
      throw new Error(`Static Maps API error: ${imageResponse.status}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })

  } catch (error) {
    console.error('Static map error:', error)
    return new Response(
      JSON.stringify({ error: 'Kartenfehler' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
