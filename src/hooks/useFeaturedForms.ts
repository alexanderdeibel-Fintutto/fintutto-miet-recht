import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface FeaturedForm {
  slug: string
  name: string
  description: string | null
  category: string
  tier: string
  usage_count: number
  priority_score: number
}

export function useFeaturedForms(limit: number = 6) {
  return useQuery({
    queryKey: ['featured-forms', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_featured_forms', { limit_count: limit })

      if (error) throw error
      return data as FeaturedForm[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - more frequent updates for popularity
  })
}
