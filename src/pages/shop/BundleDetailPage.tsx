import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { FormCard } from '@/components/shop/FormCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  CreditCard,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useBundle } from '@/hooks/useBundles';
import { useFormTemplates } from '@/hooks/useFormTemplates';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/formConstants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function BundleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { data: bundle, isLoading: isLoadingBundle } = useBundle(slug || '');

  // Get form IDs from bundle
  const formIds = bundle?.forms.map(f => {
    const formData = f.form_templates as unknown as { id: string } | null;
    return formData?.id;
  }).filter(Boolean) || [];

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/bundles/${slug}`,
          message: 'Bitte melden Sie sich an, um fortzufahren.' 
        } 
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-bundle-checkout', {
        body: { bundleId: bundle?.id },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Fehler beim Erstellen der Checkout-Session');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingBundle) {
    return (
      <div className="min-h-screen bg-background">
        <ShopHeader showSearch={false} />
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-background">
        <ShopHeader showSearch={false} />
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h1 className="text-2xl font-bold mb-2">Bundle nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">
            Das gesuchte Bundle existiert nicht oder ist nicht mehr verfügbar.
          </p>
          <Button asChild>
            <Link to="/">Zurück zur Übersicht</Link>
          </Button>
        </div>
      </div>
    );
  }

  const savingsPercent = bundle.totalValue > 0 
    ? Math.round((bundle.savings / bundle.totalValue) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader showSearch={false} />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container py-3">
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link to="/#bundles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu Bundles
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Bundle info and forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{bundle.name}</h1>
                  <p className="text-muted-foreground">
                    {bundle.forms.length} Formulare enthalten
                  </p>
                </div>
              </div>
              {bundle.description && (
                <p className="text-lg text-muted-foreground">{bundle.description}</p>
              )}
            </div>

            {/* Included forms */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Enthaltene Formulare</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bundle.forms.map((bundleForm) => {
                  const form = bundleForm.form_templates as unknown as {
                    id: string;
                    slug: string;
                    name: string;
                    price_cents: number;
                    tier: string;
                    category?: string;
                    persona?: string;
                    description?: string;
                  } | null;
                  
                  if (!form) return null;

                  return (
                    <Card key={form.id} className="group hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Link 
                              to={`/formulare/${form.slug}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {form.name}
                            </Link>
                            <p className="text-sm text-muted-foreground line-through">
                              {formatPrice(form.price_cents)}
                            </p>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Price comparison table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preisvergleich</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Einzelkauf (alle Formulare)</span>
                    <span className="line-through text-muted-foreground">
                      {formatPrice(bundle.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bundle-Preis</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(bundle.price_cents)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium text-success">Ihre Ersparnis</span>
                    <span className="font-bold text-success">
                      {formatPrice(bundle.savings)} ({savingsPercent}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Purchase card */}
          <div>
            <Card className="sticky top-24 border-2 border-primary/20">
              <CardContent className="p-6 space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-4xl font-bold text-primary">
                      {formatPrice(bundle.price_cents)}
                    </span>
                    {savingsPercent > 0 && (
                      <Badge className="bg-success text-success-foreground">
                        <Sparkles className="h-3 w-3 mr-1" />
                        -{savingsPercent}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    statt {formatPrice(bundle.totalValue)}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{bundle.forms.length} Formulare</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Unbegrenzte Nutzung</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>PDF-Download</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Rechtssicher & aktuell</span>
                  </li>
                </ul>

                {/* CTA */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  Bundle kaufen
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Sichere Zahlung über Stripe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinTuttO. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
