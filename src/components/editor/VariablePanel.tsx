import { useState } from 'react';
import { Search, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { FormVariable } from './types';

interface VariablePanelProps {
  open: boolean;
  onClose: () => void;
  variables: FormVariable[];
  onInsertVariable: (key: string, label: string) => void;
}

const DEFAULT_VARIABLES: FormVariable[] = [
  // Vermieter
  { key: 'vermieter_name', label: 'Vermieter Name', category: 'Vermieter', example: 'Max Mustermann' },
  { key: 'vermieter_adresse', label: 'Vermieter Adresse', category: 'Vermieter', example: 'Musterstraße 1, 12345 Berlin' },
  { key: 'vermieter_email', label: 'Vermieter E-Mail', category: 'Vermieter', example: 'vermieter@example.de' },
  { key: 'vermieter_telefon', label: 'Vermieter Telefon', category: 'Vermieter', example: '030 123456' },
  { key: 'vermieter_iban', label: 'Vermieter IBAN', category: 'Vermieter', example: 'DE89 3704 0044 0532 0130 00' },
  
  // Mieter
  { key: 'mieter_name', label: 'Mieter Name', category: 'Mieter', example: 'Erika Musterfrau' },
  { key: 'mieter_adresse', label: 'Mieter Adresse', category: 'Mieter', example: 'Beispielweg 2, 54321 München' },
  { key: 'mieter_email', label: 'Mieter E-Mail', category: 'Mieter', example: 'mieter@example.de' },
  { key: 'mieter_telefon', label: 'Mieter Telefon', category: 'Mieter', example: '089 654321' },
  { key: 'mieter_geburtsdatum', label: 'Mieter Geburtsdatum', category: 'Mieter', example: '01.01.1985' },
  
  // Objekt
  { key: 'objekt_adresse', label: 'Objekt Adresse', category: 'Objekt', example: 'Wohnstraße 10, 10115 Berlin' },
  { key: 'objekt_typ', label: 'Objekt Typ', category: 'Objekt', example: 'Wohnung' },
  { key: 'objekt_groesse', label: 'Wohnfläche (m²)', category: 'Objekt', example: '75' },
  { key: 'objekt_zimmer', label: 'Zimmeranzahl', category: 'Objekt', example: '3' },
  { key: 'objekt_etage', label: 'Etage', category: 'Objekt', example: '2. OG' },
  
  // Mietvertrag
  { key: 'mietbeginn', label: 'Mietbeginn', category: 'Vertrag', example: '01.04.2024' },
  { key: 'mietende', label: 'Mietende', category: 'Vertrag', example: '31.03.2026' },
  { key: 'kaltmiete', label: 'Kaltmiete (€)', category: 'Vertrag', example: '850,00' },
  { key: 'nebenkosten', label: 'Nebenkosten (€)', category: 'Vertrag', example: '150,00' },
  { key: 'warmmiete', label: 'Warmmiete (€)', category: 'Vertrag', example: '1.000,00' },
  { key: 'kaution', label: 'Kaution (€)', category: 'Vertrag', example: '2.550,00' },
  
  // Dokument
  { key: 'datum_heute', label: 'Heutiges Datum', category: 'Dokument', example: '15.01.2024' },
  { key: 'dokument_name', label: 'Dokumentname', category: 'Dokument', example: 'Mietvertrag' },
  { key: 'seite', label: 'Seitenzahl', category: 'Dokument', example: '1' },
  { key: 'seiten_gesamt', label: 'Gesamtseiten', category: 'Dokument', example: '5' },
];

export function VariablePanel({
  open,
  onClose,
  variables = DEFAULT_VARIABLES,
  onInsertVariable,
}: VariablePanelProps) {
  const [search, setSearch] = useState('');

  const allVariables = variables.length > 0 ? variables : DEFAULT_VARIABLES;
  
  const filteredVariables = allVariables.filter(
    (v) =>
      v.label.toLowerCase().includes(search.toLowerCase()) ||
      v.key.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedVariables = filteredVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, FormVariable[]>);

  const handleDragStart = (e: React.DragEvent, variable: FormVariable) => {
    e.dataTransfer.setData('variable', JSON.stringify(variable));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Variablen</SheetTitle>
          <SheetDescription>
            Ziehen Sie Variablen in den Editor oder klicken Sie zum Einfügen.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Variablen suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-6 pr-4">
              {Object.entries(groupedVariables).map(([category, vars]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {vars.map((variable) => (
                      <div
                        key={variable.key}
                        draggable
                        onDragStart={(e) => handleDragStart(e, variable)}
                        onClick={() => onInsertVariable(variable.key, variable.label)}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer group"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{variable.label}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            Beispiel: {variable.example}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          {`{{${variable.key}}}`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(groupedVariables).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Keine Variablen gefunden.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
