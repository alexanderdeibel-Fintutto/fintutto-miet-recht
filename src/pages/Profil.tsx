import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Mail, User, LogOut, CheckCircle2, Loader2, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PRICING_PLANS } from '@/lib/constants';

export default function Profil() {
  const { user, profile, signOut, session } = useAuth();
  const { plan, isActive, subscription, loading: subLoading, refresh } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showUpgrade = searchParams.get('upgrade') === 'true';
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleManageSubscription = async () => {
    if (!session) return;
    
    setLoadingPortal(true);
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
      console.error('Portal error:', err);
      toast.error('Fehler beim Öffnen des Kundenportals');
    } finally {
      setLoadingPortal(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    if (!session) {
      navigate('/register');
      return;
    }

    setLoadingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/dashboard/profil`,
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
      console.error('Checkout error:', err);
      toast.error('Fehler beim Erstellen der Checkout-Session');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const planNames: Record<string, string> = {
    free: 'Kostenlos',
    basic: 'Basic',
    pro: 'Pro',
    business: 'Business',
  };

  const currentPlanConfig = PRICING_PLANS.find(p => p.id === plan);
  const proPlan = PRICING_PLANS.find(p => p.id === 'pro');

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>Ihre Kontoinformationen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{profile?.full_name || 'Unbekannt'}</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mitglied seit</span>
              <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Abonnement</span>
              {subLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isActive && plan !== 'free' ? (
                <Badge className="bg-secondary">
                  <Crown className="h-3 w-3 mr-1" />
                  {planNames[plan]}
                </Badge>
              ) : (
                <Badge variant="outline">Kostenlos</Badge>
              )}
            </div>
            {subscription?.subscription_end && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {subscription.cancel_at_period_end ? 'Endet am' : 'Verlängert am'}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(subscription.subscription_end).toLocaleDateString('de-DE')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Management Card */}
        {isActive && plan !== 'free' && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Crown className="h-5 w-5" />
                {planNames[plan]}-Plan
              </CardTitle>
              <CardDescription>
                Verwalten Sie Ihr Abonnement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="space-y-2">
                  {currentPlanConfig?.features.filter(f => f.included).slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                >
                  {loadingPortal ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Abo verwalten
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => refresh()}
                >
                  Status aktualisieren
                </Button>
              </div>
              {subscription?.cancel_at_period_end && (
                <p className="text-sm text-warning text-center">
                  Ihr Abonnement wird nicht verlängert und endet am{' '}
                  {new Date(subscription.subscription_end!).toLocaleDateString('de-DE')}.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upgrade Card */}
        {(!isActive || plan === 'free') && proPlan && (
          <Card className={`card-shadow border-secondary ${showUpgrade ? 'ring-2 ring-secondary' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Crown className="h-5 w-5" />
                Upgrade auf {proPlan.name}
              </CardTitle>
              <CardDescription>Schalten Sie alle Funktionen frei</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  €{(proPlan.monthlyPrice / 100).toFixed(2)}
                  <span className="text-lg font-normal text-muted-foreground">/Monat</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {proPlan.features.filter(f => f.included).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    {feature.text}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => handleUpgrade(proPlan.monthlyPriceId!)}
                  disabled={loadingCheckout}
                >
                  {loadingCheckout ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Laden...
                    </>
                  ) : (
                    'Jetzt upgraden'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
                  Alle Pläne vergleichen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
