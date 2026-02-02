import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Package, 
  Sparkles, 
  Loader2,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { formatPrice, FORM_TIERS } from '@/lib/formConstants';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { FormTemplate } from '@/hooks/useFormTemplates';
import type { BundleWithForms } from '@/hooks/useBundles';

interface PriceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: FormTemplate;
  suggestedBundle?: BundleWithForms;
}

export function PriceModal({ 
  open, 
  onOpenChange, 
  template, 
  suggestedBundle 
}: PriceModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'single' | 'bundle'>('single');

  const tier = template.tier as keyof typeof FORM_TIERS;
  const tierConfig = FORM_TIERS[tier] || FORM_TIERS.free;

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login
      navigate('/login', { 
        state: { 
          from: `/formulare/${template.slug}`,
          message: 'Bitte melden Sie sich an, um fortzufahren.' 
        } 
      });
      onOpenChange(false);
      return;
    }

    setIsLoading(true);

    try {
      if (selectedOption === 'bundle' && suggestedBundle) {
        // Create bundle checkout
        const { data, error } = await supabase.functions.invoke('create-bundle-checkout', {
          body: { bundleId: suggestedBundle.id },
        });

        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } else {
        // Create single form checkout
        const { data, error } = await supabase.functions.invoke('create-form-checkout', {
          body: { formTemplateId: template.id },
        });

        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Fehler beim Erstellen der Checkout-Session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {template.name}
          </DialogTitle>
          <DialogDescription>
            Wählen Sie eine Kaufoption
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Single form option */}
          <button
            onClick={() => setSelectedOption('single')}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              selectedOption === 'single' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Einzelformular</span>
                  <Badge className={tierConfig.color}>{tierConfig.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Einmaliger Kauf, unbegrenzte Nutzung
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(template.price_cents)}
                </span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                PDF-Download
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Unbegrenzte Bearbeitungen
              </li>
            </ul>
          </button>

          {/* Bundle option */}
          {suggestedBundle && (
            <>
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  oder
                </span>
              </div>

              <button
                onClick={() => setSelectedOption('bundle')}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedOption === 'bundle' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">{suggestedBundle.name}</span>
                      <Badge className="bg-success text-success-foreground">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Spare {Math.round((suggestedBundle.savings / suggestedBundle.totalValue) * 100)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestedBundle.forms.length} Formulare inklusive
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(suggestedBundle.price_cents)}
                    </span>
                    <span className="block text-sm text-muted-foreground line-through">
                      {formatPrice(suggestedBundle.totalValue)}
                    </span>
                  </div>
                </div>
              </button>
            </>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button 
            onClick={handlePurchase} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wird geladen...
              </>
            ) : user ? (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Jetzt kaufen
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Anmelden & Kaufen
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
