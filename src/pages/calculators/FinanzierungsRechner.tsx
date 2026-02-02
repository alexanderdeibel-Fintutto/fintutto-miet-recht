import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Wallet } from 'lucide-react';

import { Database } from '@/integrations/supabase/types';
type Json = Database['public']['Tables']['calculations']['Insert']['input_json'];

interface FinanzierungInputs {
  darlehenssumme: number;
  zinssatz: number;
  tilgungssatz: number;
  laufzeit: number;
}

interface TilgungsplanRow {
  jahr: number;
  restschuld: number;
  zinsen: number;
  tilgung: number;
  jahresrate: number;
}

interface FinanzierungResults {
  monatlicheRate: number;
  gesamtZinsen: number;
  gesamtTilgung: number;
  tilgungsplan: TilgungsplanRow[];
}

export default function FinanzierungsRechner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState<FinanzierungInputs>({
    darlehenssumme: 250000,
    zinssatz: 3.5,
    tilgungssatz: 2.0,
    laufzeit: 30,
  });

  const [results, setResults] = useState<FinanzierungResults | null>(null);

  const calculate = () => {
    const jahresrate = inputs.darlehenssumme * (inputs.zinssatz + inputs.tilgungssatz) / 100;
    const monatlicheRate = jahresrate / 12;
    
    const tilgungsplan: TilgungsplanRow[] = [];
    let restschuld = inputs.darlehenssumme;
    let gesamtZinsen = 0;
    let gesamtTilgung = 0;

    for (let jahr = 1; jahr <= inputs.laufzeit && restschuld > 0; jahr++) {
      const zinsen = restschuld * (inputs.zinssatz / 100);
      const tilgung = Math.min(jahresrate - zinsen, restschuld);
      restschuld = Math.max(0, restschuld - tilgung);
      
      gesamtZinsen += zinsen;
      gesamtTilgung += tilgung;

      tilgungsplan.push({
        jahr,
        restschuld,
        zinsen,
        tilgung,
        jahresrate: zinsen + tilgung,
      });
    }

    setResults({
      monatlicheRate,
      gesamtZinsen,
      gesamtTilgung,
      tilgungsplan,
    });
  };

  const handleSave = async () => {
    if (!user || !results) return;

    const { error } = await supabase.from('calculations').insert([{
      user_id: user.id,
      title: `Finanzierung: ${formatCurrency(inputs.darlehenssumme)}`,
      type: 'finanzierung' as const,
      input_json: inputs as unknown as Json,
      result_json: { ...results, tilgungsplan: results.tilgungsplan.slice(0, 10) } as unknown as Json,
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
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard/rechner')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Rechner
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Finanzierungsrechner</CardTitle>
                  <CardDescription>Eingaben</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="darlehenssumme">Darlehenssumme (€)</Label>
                <Input
                  id="darlehenssumme"
                  type="number"
                  value={inputs.darlehenssumme}
                  onChange={(e) => setInputs({ ...inputs, darlehenssumme: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="zinssatz">Zinssatz (%)</Label>
                <Input
                  id="zinssatz"
                  type="number"
                  step="0.1"
                  value={inputs.zinssatz}
                  onChange={(e) => setInputs({ ...inputs, zinssatz: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="tilgungssatz">Anfänglicher Tilgungssatz (%)</Label>
                <Input
                  id="tilgungssatz"
                  type="number"
                  step="0.1"
                  value={inputs.tilgungssatz}
                  onChange={(e) => setInputs({ ...inputs, tilgungssatz: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="laufzeit">Maximale Laufzeit (Jahre)</Label>
                <Input
                  id="laufzeit"
                  type="number"
                  value={inputs.laufzeit}
                  onChange={(e) => setInputs({ ...inputs, laufzeit: Number(e.target.value) })}
                />
              </div>
              <Button onClick={calculate} className="w-full">
                Berechnen
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Ergebnisse</CardTitle>
              <CardDescription>Ihre Finanzierungskennzahlen</CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10">
                      <p className="text-sm text-muted-foreground">Monatliche Rate</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(results.monatlicheRate)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground">Gesamtzinsen</p>
                      <p className="text-xl font-bold">{formatCurrency(results.gesamtZinsen)}</p>
                    </div>
                  </div>

                  <Button onClick={handleSave} variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Berechnung speichern
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Geben Sie Ihre Daten ein und klicken Sie auf "Berechnen".</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tilgungsplan */}
        {results && (
          <Card className="mt-6 card-shadow">
            <CardHeader>
              <CardTitle>Tilgungsplan</CardTitle>
              <CardDescription>Jährliche Übersicht Ihrer Finanzierung</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jahr</TableHead>
                      <TableHead className="text-right">Restschuld</TableHead>
                      <TableHead className="text-right">Zinsen</TableHead>
                      <TableHead className="text-right">Tilgung</TableHead>
                      <TableHead className="text-right">Jahresrate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.tilgungsplan.map((row) => (
                      <TableRow key={row.jahr}>
                        <TableCell>{row.jahr}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.restschuld)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.zinsen)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.tilgung)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(row.jahresrate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
