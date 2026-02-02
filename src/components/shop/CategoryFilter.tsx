import { Button } from '@/components/ui/button';
import { FORM_CATEGORIES } from '@/lib/formConstants';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CategoryFilter({ value, onValueChange, className }: CategoryFilterProps) {
  const categories = [
    { key: 'alle', label: 'Alle' },
    ...Object.entries(FORM_CATEGORIES).map(([key, config]) => ({
      key,
      label: config.label,
    })),
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((category) => (
        <Button
          key={category.key}
          variant={value === category.key ? "default" : "outline"}
          size="sm"
          onClick={() => onValueChange(category.key)}
          className={cn(
            "transition-all",
            value === category.key && "shadow-md"
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
