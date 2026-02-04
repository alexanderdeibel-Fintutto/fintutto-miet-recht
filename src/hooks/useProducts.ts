import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Product {
  id: string
  app_id: string
  name: string
  description: string | null
  price_cents: number
  stripe_price_id: string | null
  features: string[]
  icon_url: string | null
  app_url: string | null
  is_active: boolean
  sort_order: number
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      return data as Product[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useProduct(appId: string) {
  const { data: products, ...rest } = useProducts()
  return {
    ...rest,
    data: products?.find(p => p.app_id === appId),
  }
}
