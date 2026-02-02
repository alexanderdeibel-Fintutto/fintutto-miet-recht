import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Formular suchen...",
  className,
  size = 'md'
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  const handleClear = () => {
    onChange('');
  };

  const sizeClasses = {
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
          iconSizes[size]
        )} />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "pl-12 pr-20",
            sizeClasses[size],
            size === 'lg' && "rounded-xl"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button 
            type="submit" 
            size={size === 'lg' ? 'default' : 'sm'}
            className={size === 'lg' ? 'px-6' : ''}
          >
            Suchen
          </Button>
        </div>
      </div>
    </form>
  );
}
