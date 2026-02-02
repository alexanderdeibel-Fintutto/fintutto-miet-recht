import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { formatPrice, FORM_TIERS, FORM_CATEGORIES } from '@/lib/formConstants';
import { cn } from '@/lib/utils';
import type { FormTemplate } from '@/hooks/useFormTemplates';

interface FormCardProps {
  form: FormTemplate;
  className?: string;
}

export function FormCard({ form, className }: FormCardProps) {
  const tier = form.tier as keyof typeof FORM_TIERS;
  const category = form.category as keyof typeof FORM_CATEGORIES;
  const tierConfig = FORM_TIERS[tier] || FORM_TIERS.free;
  const categoryConfig = FORM_CATEGORIES[category];

  return (
    <Link to={`/formulare/${form.slug}`}>
      <Card className={cn(
        "group h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer overflow-hidden",
        className
      )}>
        {/* Thumbnail area */}
        <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
          {form.thumbnail_url ? (
            <img 
              src={form.thumbnail_url} 
              alt={form.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-2" />
              <span className="text-xs uppercase tracking-wider">{categoryConfig?.label || 'Formular'}</span>
            </div>
          )}
          
          {/* Tier Badge */}
          <Badge 
            className={cn(
              "absolute top-3 right-3 text-xs font-semibold",
              tierConfig.color
            )}
          >
            {tierConfig.label}
          </Badge>

          {/* Hover overlay with description */}
          {form.description && (
            <div className="absolute inset-0 bg-foreground/80 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex items-center justify-center">
              <p className="text-sm text-center line-clamp-4">{form.description}</p>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {categoryConfig?.label || form.category}
          </p>
          
          {/* Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {form.name}
          </h3>

          {/* Price */}
          <p className={cn(
            "text-lg font-bold",
            form.price_cents === 0 ? "text-success" : "text-primary"
          )}>
            {formatPrice(form.price_cents)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
