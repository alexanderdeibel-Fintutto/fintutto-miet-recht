import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PricingCard } from '@/components/PricingCard';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PRICING_PLANS } from '@/lib/constants';

export default function Pricing() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { plan: currentPlan, loading: subLoading } = useSubscription();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    // Free plan - just register
    if (planId === 'free') {
      if (!user) {
        navigate('/register');
      }
      return;
    }

    // Not logged in - redirect to register
    if (!user || !session) {
      navigate('/register');
      return;
    }

    // Current plan - do nothing
    if (planId === currentPlan) {
      return;
    }

    // Already subscribed - open customer portal
    if (currentPlan !== 'free') {
      setLoadingPlan(planId);
      try {
        const { data, error } = await supabase.functions.invoke('customer-portal', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } catch (err) {
        toast.error('Fehler beim Öffnen des Kundenportals');
      } finally {
        setLoadingPlan(null);
      }
      return;
    }

    // Create checkout session
    const plan = PRICING_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;
    if (!priceId) {
      toast.error('Dieser Plan ist nicht verfügbar');
      return;
    }

    setLoadingPlan(planId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error('Fehler beim Erstellen der Checkout-Session');
    } finally {
      setLoadingPlan(null);
    }
  };

  const getButtonText = (planId: string) => {
    if (!user) return 'Registrieren';
    if (planId === currentPlan) return 'Aktueller Plan';
    if (currentPlan !== 'free' && planId !== 'free') return 'Plan ändern';
    if (planId === 'free') return 'Kostenlos';
    return 'Jetzt upgraden';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-medium">Preise</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Wählen Sie Ihren Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Starten Sie kostenlos und upgraden Sie jederzeit, um alle Funktionen freizuschalten.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label 
            htmlFor="billing-toggle" 
            className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}
          >
            Monatlich
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label 
            htmlFor="billing-toggle" 
            className={isYearly ? 'font-semibold' : 'text-muted-foreground'}
          >
            Jährlich
            <span className="ml-2 text-xs text-secondary font-medium">
              (Spare 20%)
            </span>
          </Label>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              planId={plan.id}
              name={plan.name}
              description={plan.description}
              monthlyPrice={plan.monthlyPrice}
              yearlyPrice={plan.yearlyPrice}
              isYearly={isYearly}
              features={plan.features}
              isPopular={plan.isPopular}
              isCurrentPlan={currentPlan === plan.id && !!user}
              onSelect={() => handleSelectPlan(plan.id)}
              loading={loadingPlan === plan.id || (subLoading && !!user)}
              buttonText={getButtonText(plan.id)}
            />
          ))}
        </div>

        {/* FAQ/Notes */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Alle Preise verstehen sich inklusive MwSt. Sie können jederzeit kündigen.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Fragen? Kontaktieren Sie uns unter{' '}
            <a href="mailto:support@fintutto.de" className="text-primary hover:underline">
              support@fintutto.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
