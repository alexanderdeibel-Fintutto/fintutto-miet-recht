import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Bundle = Tables<'bundles'>;

export interface BundleWithForms extends Bundle {
  forms: Array<{
    form_template_id: string;
    form_templates: {
      id: string;
      slug: string;
      name: string;
      price_cents: number;
      tier: string;
    };
  }>;
  totalValue: number;
  savings: number;
}

export function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      const { data: bundles, error: bundlesError } = await supabase
        .from('bundles')
        .select('*')
        .eq('is_active', true)
        .order('price_cents', { ascending: true });

      if (bundlesError) throw bundlesError;

      // Fetch bundle-form relationships with form details
      const bundlesWithForms: BundleWithForms[] = await Promise.all(
        (bundles || []).map(async (bundle) => {
          const { data: bundleForms, error: formsError } = await supabase
            .from('bundle_form_templates')
            .select(`
              form_template_id,
              form_templates (
                id,
                slug,
                name,
                price_cents,
                tier
              )
            `)
            .eq('bundle_id', bundle.id);

          if (formsError) throw formsError;

          // Calculate total value and savings
          const totalValue = (bundleForms || []).reduce((sum, bf) => {
            const formData = bf.form_templates as unknown as { price_cents: number } | null;
            return sum + (formData?.price_cents || 0);
          }, 0);

          const savings = totalValue - bundle.price_cents;

          return {
            ...bundle,
            forms: bundleForms || [],
            totalValue,
            savings,
          } as BundleWithForms;
        })
      );

      return bundlesWithForms;
    },
  });
}

export function useBundle(slug: string) {
  return useQuery({
    queryKey: ['bundle', slug],
    queryFn: async () => {
      const { data: bundle, error: bundleError } = await supabase
        .from('bundles')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (bundleError) throw bundleError;

      // Fetch included forms
      const { data: bundleForms, error: formsError } = await supabase
        .from('bundle_form_templates')
        .select(`
          form_template_id,
          form_templates (
            id,
            slug,
            name,
            description,
            price_cents,
            tier,
            category,
            persona
          )
        `)
        .eq('bundle_id', bundle.id);

      if (formsError) throw formsError;

      const totalValue = (bundleForms || []).reduce((sum, bf) => {
        const formData = bf.form_templates as unknown as { price_cents: number } | null;
        return sum + (formData?.price_cents || 0);
      }, 0);

      const savings = totalValue - bundle.price_cents;

      return {
        ...bundle,
        forms: bundleForms || [],
        totalValue,
        savings,
      } as BundleWithForms;
    },
    enabled: !!slug,
  });
}
