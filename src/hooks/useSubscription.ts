import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SubscriptionData {
  subscribed: boolean;
  plan: 'free' | 'basic' | 'pro' | 'business';
  product_id: string | null;
  subscription_end: string | null;
  cancel_at_period_end: boolean;
}

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null;
  plan: 'free' | 'basic' | 'pro' | 'business';
  isPro: boolean;
  isBasic: boolean;
  isActive: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!user || !session) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fnError } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      setSubscription(data as SubscriptionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check subscription';
      setError(errorMessage);
      // Set default free state on error
      setSubscription({
        subscribed: false,
        plan: 'free',
        product_id: null,
        subscription_end: null,
        cancel_at_period_end: false,
      });
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const plan = subscription?.plan || 'free';
  const isPro = ['pro', 'business'].includes(plan);
  const isBasic = plan === 'basic';
  const isActive = subscription?.subscribed || false;

  return {
    subscription,
    plan,
    isPro,
    isBasic,
    isActive,
    loading,
    error,
    refresh: checkSubscription,
  };
}
