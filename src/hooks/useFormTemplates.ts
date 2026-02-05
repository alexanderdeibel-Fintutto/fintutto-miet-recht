import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface FormTemplate {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  tier: string
  persona: string
  thumbnail_url: string | null
  sort_order: number | null
}

export function useFormTemplates() {
  return useQuery({
    queryKey: ['form-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_form_templates_public')
        .select('id, slug, name, description, category, tier, persona, thumbnail_url, sort_order')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      return data as FormTemplate[]
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Category labels for display
export const CATEGORY_LABELS: Record<string, string> = {
  vertraege: 'Verträge',
  schreiben: 'Schreiben & Briefe',
  abrechnungen: 'Abrechnungen',
  protokolle: 'Protokolle',
  sonstige: 'Sonstiges',
}

// Tier badges
export const TIER_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  free: { label: 'Kostenlos', variant: 'outline' },
  basic: { label: 'Basic', variant: 'secondary' },
  premium: { label: 'Premium', variant: 'default' },
}

// Persona labels
export const PERSONA_LABELS: Record<string, string> = {
  vermieter: 'Für Vermieter',
  mieter: 'Für Mieter',
  beide: 'Für beide',
}
