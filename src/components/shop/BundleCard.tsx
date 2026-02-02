import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/formConstants';
import { cn } from '@/lib/utils';
import type { BundleWithForms } from '@/hooks/useBundles';

interface BundleCardProps {
  bundle: BundleWithForms;
  className?: string;
}

export function BundleCard({ bundle, className }: BundleCardProps) {
  const savingsPercent = bundle.totalValue > 0 
    ? Math.round((bundle.savings / bundle.totalValue) * 100) 
    : 0;

  return (
    <Link to={`/bundles/${bundle.slug}`}>
      <Card className={cn(
        "group h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer overflow-hidden border-2 border-primary/20",
        className
      )}>
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary to-secondary p-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{bundle.name}</h3>
                <p className="text-sm text-primary-foreground/80">
                  {bundle.forms.length} Formulare enthalten
                </p>
              </div>
            </div>
            
            {savingsPercent > 0 && (
              <Badge className="bg-success text-success-foreground">
                {savingsPercent}% sparen
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Description */}
          {bundle.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {bundle.description}
            </p>
          )}

          {/* Price comparison */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(bundle.price_cents)}
            </span>
            {bundle.totalValue > bundle.price_cents && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(bundle.totalValue)}
              </span>
            )}
          </div>

          {/* CTA */}
          <Button className="w-full group-hover:bg-primary/90" asChild>
            <span>
              Bundle ansehen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
