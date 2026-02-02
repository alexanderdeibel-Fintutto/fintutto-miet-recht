import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type FormTemplate = Tables<'form_templates'>;

export interface UseFormTemplatesOptions {
  persona?: string;
  category?: string;
  tier?: string;
  search?: string;
  sortBy?: 'popular' | 'price' | 'name';
  limit?: number;
}

export function useFormTemplates(options: UseFormTemplatesOptions = {}) {
  const { persona, category, tier, search, sortBy = 'popular', limit } = options;

  return useQuery({
    queryKey: ['form-templates', { persona, category, tier, search, sortBy, limit }],
    queryFn: async () => {
      let query = supabase
        .from('form_templates')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (persona && persona !== 'alle') {
        query = query.or(`persona.eq.${persona},persona.eq.beide`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (tier) {
        query = query.eq('tier', tier);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price':
          query = query.order('price_cents', { ascending: true });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'popular':
        default:
          query = query.order('sort_order', { ascending: true });
          break;
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FormTemplate[];
    },
  });
}

export function useFormTemplate(slug: string) {
  return useQuery({
    queryKey: ['form-template', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_templates')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as FormTemplate;
    },
    enabled: !!slug,
  });
}
