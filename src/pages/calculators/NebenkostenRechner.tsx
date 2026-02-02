import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Receipt, Plus, Trash2 } from 'lucide-react';

import { Database } from '@/integrations/supabase/types';
type Json = Database['public']['Tables']['calculations']['Insert']['input_json'];

interface Kostenposition {
  id: string;
  bezeichnung: string;
  gesamtkosten: number;
}

interface NebenkostenResults {
  positionen: { bezeichnung: string; mieteranteil: number }[];
  gesamtMieteranteil: number;
}

export default function NebenkostenRechner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [wohnungsflaeche, setWohnungsflaeche] = useState(75);
  const [gesamtflaeche, setGesamtflaeche] = useState(500);
  const [positionen, setPositionen] = useState<Kostenposition[]>([
    { id: '1', bezeichnung: 'Heizkosten', gesamtkosten: 5000 },
    { id: '2', bezeichnung: 'Wasser/Abwasser', gesamtkosten: 1500 },
    { id: '3', bezeichnung: 'Müllabfuhr', gesamtkosten: 800 },
    { id: '4', bezeichnung: 'Hausmeister', gesamtkosten: 1200 },
  ]);

  const [results, setResults] = useState<NebenkostenResults | null>(null);

  const addPosition = () => {
    setPositionen([
      ...positionen,
      { id: Date.now().toString(), bezeichnung: '', gesamtkosten: 0 },
    ]);
  };

  const removePosition = (id: string) => {
    setPositionen(positionen.filter((p) => p.id !== id));
  };

  const updatePosition = (id: string, field: keyof Kostenposition, value: string | number) => {
    setPositionen(
      positionen.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculate = () => {
    const anteil = wohnungsflaeche / gesamtflaeche;
    const positionenMitAnteil = positionen
      .filter((p) => p.bezeichnung && p.gesamtkosten > 0)
      .map((p) => ({
        bezeichnung: p.bezeichnung,
        mieteranteil: p.gesamtkosten * anteil,
      }));

    const gesamtMieteranteil = positionenMitAnteil.reduce((sum, p) => sum + p.mieteranteil, 0);

    setResults({
      positionen: positionenMitAnteil,
      gesamtMieteranteil,
    });
  };

  const handleSave = async () => {
    if (!user || !results) return;

    const { error } = await supabase.from('calculations').insert([{
      user_id: user.id,
      title: `Nebenkosten: ${wohnungsflaeche}m²`,
      type: 'nebenkosten' as const,
      input_json: { wohnungsflaeche, gesamtflaeche, positionen } as unknown as Json,
      result_json: results as unknown as Json,
    }]);

    if (error) {
      toast({ variant: 'destructive', title: 'Fehler', description: 'Berechnung konnte nicht gespeichert werden.' });
    } else {
      toast({ title: 'Gespeichert', description: 'Berechnung wurde erfolgreich gespeichert.' });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard/rechner')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Rechner
        </Button>

        <div className="grid gap-6">
          {/* Input Card */}
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle>Nebenkostenrechner</CardTitle>
                  <CardDescription>Verteilen Sie die Betriebskosten nach Wohnfläche</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wohnungsflaeche">Wohnungsfläche (m²)</Label>
                  <Input
                    id="wohnungsflaeche"
                    type="number"
                    value={wohnungsflaeche}
                    onChange={(e) => setWohnungsflaeche(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="gesamtflaeche">Gesamtfläche des Gebäudes (m²)</Label>
                  <Input
                    id="gesamtflaeche"
                    type="number"
                    value={gesamtflaeche}
                    onChange={(e) => setGesamtflaeche(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Kostenpositionen</Label>
                  <Button variant="outline" size="sm" onClick={addPosition}>
                    <Plus className="h-4 w-4 mr-2" />
                    Hinzufügen
                  </Button>
                </div>
                <div className="space-y-3">
                  {positionen.map((pos) => (
                    <div key={pos.id} className="flex gap-3 items-center">
                      <Input
                        placeholder="Bezeichnung"
                        value={pos.bezeichnung}
                        onChange={(e) => updatePosition(pos.id, 'bezeichnung', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Gesamtkosten"
                        value={pos.gesamtkosten || ''}
                        onChange={(e) => updatePosition(pos.id, 'gesamtkosten', Number(e.target.value))}
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePosition(pos.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={calculate} className="w-full">
                Berechnen
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          {results && (
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Ergebnisse</CardTitle>
                <CardDescription>
                  Anteil: {((wohnungsflaeche / gesamtflaeche) * 100).toFixed(2)}% der Gesamtfläche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-right">Mieteranteil</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.positionen.map((pos, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{pos.bezeichnung}</TableCell>
                        <TableCell className="text-right">{formatCurrency(pos.mieteranteil)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell>Gesamt</TableCell>
                      <TableCell className="text-right text-primary">
                        {formatCurrency(results.gesamtMieteranteil)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Button onClick={handleSave} variant="outline" className="w-full mt-6">
                  <Save className="h-4 w-4 mr-2" />
                  Berechnung speichern
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
