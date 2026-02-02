import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface FormAccessInfo {
  formTemplateId: string;
  hasAccess: boolean;
  accessReason: 'free' | 'purchased' | 'bundle' | 'subscription' | 'none';
}

export function useFormAccess(formTemplateId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['form-access', formTemplateId, user?.id],
    queryFn: async (): Promise<FormAccessInfo> => {
      if (!formTemplateId) {
        return { formTemplateId: '', hasAccess: false, accessReason: 'none' };
      }

      // If not logged in, check if form is free
      if (!user) {
        const { data: template } = await supabase
          .from('form_templates')
          .select('tier')
          .eq('id', formTemplateId)
          .single();

        const isFree = template?.tier === 'free';
        return {
          formTemplateId,
          hasAccess: isFree,
          accessReason: isFree ? 'free' : 'none',
        };
      }

      // Use the v_user_available_forms view
      const { data: accessData, error } = await supabase
        .from('v_user_available_forms')
        .select('*')
        .eq('form_template_id', formTemplateId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking form access:', error);
      }

      if (!accessData) {
        // Check if form is free
        const { data: template } = await supabase
          .from('form_templates')
          .select('tier')
          .eq('id', formTemplateId)
          .single();

        const isFree = template?.tier === 'free';
        return {
          formTemplateId,
          hasAccess: isFree,
          accessReason: isFree ? 'free' : 'none',
        };
      }

      // Determine access reason
      let accessReason: FormAccessInfo['accessReason'] = 'none';
      if (accessData.has_access) {
        if (accessData.tier === 'free') {
          accessReason = 'free';
        } else {
          // Check if it's from a purchase or subscription
          const { data: purchase } = await supabase
            .from('form_purchases')
            .select('bundle_id')
            .eq('user_id', user.id)
            .eq('form_template_id', formTemplateId)
            .eq('status', 'completed')
            .maybeSingle();

          if (purchase) {
            accessReason = purchase.bundle_id ? 'bundle' : 'purchased';
          } else {
            // Check subscription
            const { data: subscription } = await supabase
              .from('user_subscriptions')
              .select('*')
              .eq('user_id', user.id)
              .eq('status', 'active')
              .maybeSingle();

            if (subscription) {
              accessReason = 'subscription';
            } else {
              // Check if purchased via bundle
              const { data: bundlePurchase } = await supabase
                .from('form_purchases')
                .select('bundle_id')
                .eq('user_id', user.id)
                .not('bundle_id', 'is', null)
                .eq('status', 'completed');

              if (bundlePurchase && bundlePurchase.length > 0) {
                accessReason = 'bundle';
              }
            }
          }
        }
      }

      return {
        formTemplateId,
        hasAccess: accessData.has_access || false,
        accessReason,
      };
    },
    enabled: !!formTemplateId,
  });
}

export function useUserPurchases() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('form_purchases')
        .select(`
          *,
          form_templates (
            id,
            slug,
            name,
            tier,
            category
          ),
          bundles (
            id,
            slug,
            name
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}
