import { FileText, Sparkles, Building2, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { DesignConfig } from './types';

interface TemplateSelectorProps {
  onSelectTemplate: (variant: 'classic' | 'modern' | 'elegant' | 'blank') => void;
  onLoadDesign?: (design: DesignConfig) => void;
  savedDesigns?: Array<{ id: string; name: string; config: DesignConfig }>;
  currentVariant: string;
}

const TEMPLATES = [
  {
    id: 'blank',
    name: 'Leeres Dokument',
    description: 'Starten Sie mit einer leeren Seite',
    icon: FileText,
    variant: 'blank' as const,
    preview: 'bg-white',
  },
  {
    id: 'classic',
    name: 'Klassisch',
    description: 'Zeitloses, formelles Design',
    icon: Building2,
    variant: 'classic' as const,
    preview: 'bg-gradient-to-b from-slate-100 to-white',
    styles: {
      fontFamily: 'Georgia, serif',
      accentColor: '#1a202c',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Klare Linien, frische Farben',
    icon: Sparkles,
    variant: 'modern' as const,
    preview: 'bg-gradient-to-br from-indigo-50 to-white',
    styles: {
      fontFamily: 'Inter, sans-serif',
      accentColor: '#6366f1',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Raffiniert und professionell',
    icon: FileText,
    variant: 'elegant' as const,
    preview: 'bg-gradient-to-br from-amber-50 to-white',
    styles: {
      fontFamily: 'Playfair Display, serif',
      accentColor: '#C8A951',
    },
  },
];

export function TemplateSelector({
  onSelectTemplate,
  onLoadDesign,
  savedDesigns = [],
  currentVariant,
}: TemplateSelectorProps) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Vorlage wählen</h3>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isSelected = currentVariant === template.variant;
            
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.variant)}
                className={cn(
                  'flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:border-primary/50',
                  isSelected ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'w-full aspect-[210/297] rounded border shadow-sm mb-2',
                    template.preview
                  )}
                >
                  {/* Mini preview */}
                  <div className="p-2 space-y-1">
                    <div
                      className="h-2 w-1/2 rounded"
                      style={{ backgroundColor: template.styles?.accentColor || '#e2e8f0' }}
                    />
                    <div className="h-1 w-full bg-slate-200 rounded" />
                    <div className="h-1 w-3/4 bg-slate-200 rounded" />
                    <div className="h-1 w-5/6 bg-slate-200 rounded" />
                  </div>
                </div>
                <span className="text-xs font-medium">{template.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {savedDesigns.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Meine Designs
          </h3>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {savedDesigns.map((design) => (
                <Button
                  key={design.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => onLoadDesign?.(design.config)}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  {design.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
