import { Check, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PricingFeature {
  readonly text: string;
  readonly included: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isYearly: boolean;
  features: readonly PricingFeature[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSelect: () => void;
  loading?: boolean;
  buttonText?: string;
  planId: string;
}

export function PricingCard({
  name,
  description,
  monthlyPrice,
  yearlyPrice,
  isYearly,
  features,
  isPopular = false,
  isCurrentPlan = false,
  onSelect,
  loading = false,
  buttonText,
  planId,
}: PricingCardProps) {
  const price = isYearly ? yearlyPrice : monthlyPrice;
  const monthlyEquivalent = isYearly ? yearlyPrice / 12 : monthlyPrice;
  const savings = isYearly ? Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100) : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isCurrentPlan) return 'Aktueller Plan';
    if (planId === 'free') return 'Kostenlos starten';
    return 'Jetzt upgraden';
  };

  return (
    <Card 
      className={cn(
        'relative flex flex-col transition-all duration-200',
        isPopular && 'border-secondary shadow-lg scale-105',
        isCurrentPlan && 'border-primary bg-primary/5'
      )}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary">
          Beliebt
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="outline">
          Ihr Plan
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2">
          {name}
          {planId !== 'free' && <Crown className="h-4 w-4 text-secondary" />}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold">
            {formatPrice(monthlyEquivalent)}
            <span className="text-lg font-normal text-muted-foreground">/Monat</span>
          </div>
          {isYearly && savings > 0 && (
            <div className="mt-1 space-y-1">
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(monthlyPrice)}/Monat
              </p>
              <Badge variant="secondary" className="text-xs">
                Spare {savings}%
              </Badge>
            </div>
          )}
          {isYearly && (
            <p className="text-xs text-muted-foreground mt-2">
              {formatPrice(price)} jährlich abgerechnet
            </p>
          )}
        </div>

        <ul className="space-y-3 flex-1 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check 
                className={cn(
                  'h-5 w-5 flex-shrink-0 mt-0.5',
                  feature.included ? 'text-success' : 'text-muted-foreground/30'
                )} 
              />
              <span className={cn(
                'text-sm',
                !feature.included && 'text-muted-foreground/50 line-through'
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onSelect}
          disabled={isCurrentPlan || loading}
          variant={isPopular ? 'default' : 'outline'}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Laden...
            </>
          ) : (
            getButtonText()
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
