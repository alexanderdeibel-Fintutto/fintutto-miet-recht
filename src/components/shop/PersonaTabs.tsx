import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Home, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonaTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function PersonaTabs({ value, onValueChange, className }: PersonaTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto">
        <TabsTrigger value="alle" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Alle</span>
        </TabsTrigger>
        <TabsTrigger value="vermieter" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">Vermieter</span>
        </TabsTrigger>
        <TabsTrigger value="mieter" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Mieter</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
