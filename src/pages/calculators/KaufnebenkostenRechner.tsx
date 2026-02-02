import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BUNDESLAENDER } from '@/lib/constants';
import { ArrowLeft, Save, Home } from 'lucide-react';

import { Database } from '@/integrations/supabase/types';
type Json = Database['public']['Tables']['calculations']['Insert']['input_json'];

interface KaufnebenkostenResults {
  grunderwerbsteuer: number;
  notarkosten: number;
  grundbuchkosten: number;
  maklerprovision: number;
  gesamtnebenkosten: number;
  gesamtkaufpreis: number;
}

export default function KaufnebenkostenRechner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [kaufpreis, setKaufpreis] = useState(300000);
  const [bundesland, setBundesland] = useState('bayern');
  const [mitMakler, setMitMakler] = useState(true);

  const [results, setResults] = useState<KaufnebenkostenResults | null>(null);

  const calculate = () => {
    const land = BUNDESLAENDER.find((b) => b.value === bundesland);
    if (!land) return;

    const grunderwerbsteuer = kaufpreis * (land.grunderwerbsteuer / 100);
    const notarkosten = kaufpreis * 0.015; // 1.5%
    const grundbuchkosten = kaufpreis * 0.005; // 0.5%
    const maklerprovision = mitMakler ? kaufpreis * 0.0357 : 0; // 3.57%

    const gesamtnebenkosten = grunderwerbsteuer + notarkosten + grundbuchkosten + maklerprovision;
    const gesamtkaufpreis = kaufpreis + gesamtnebenkosten;

    setResults({
      grunderwerbsteuer,
      notarkosten,
      grundbuchkosten,
      maklerprovision,
      gesamtnebenkosten,
      gesamtkaufpreis,
    });
  };

  const handleSave = async () => {
    if (!user || !results) return;

    const { error } = await supabase.from('calculations').insert([{
      user_id: user.id,
      title: `Kaufnebenkosten: ${formatCurrency(kaufpreis)}`,
      type: 'kaufnebenkosten' as const,
      input_json: { kaufpreis, bundesland, mitMakler } as unknown as Json,
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

  const selectedLand = BUNDESLAENDER.find((b) => b.value === bundesland);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard/rechner')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu Rechner
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Home className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <CardTitle>Kaufnebenkostenrechner</CardTitle>
                  <CardDescription>Eingaben</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kaufpreis">Kaufpreis (€)</Label>
                <Input
                  id="kaufpreis"
                  type="number"
                  value={kaufpreis}
                  onChange={(e) => setKaufpreis(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="bundesland">Bundesland</Label>
                <Select value={bundesland} onValueChange={setBundesland}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bundesland auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUNDESLAENDER.map((land) => (
                      <SelectItem key={land.value} value={land.value}>
                        {land.label} ({land.grunderwerbsteuer}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="mitMakler"
                  checked={mitMakler}
                  onChange={(e) => setMitMakler(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="mitMakler" className="cursor-pointer">
                  Mit Maklerprovision (3,57%)
                </Label>
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
              <CardDescription>
                {selectedLand && `Grunderwerbsteuer: ${selectedLand.grunderwerbsteuer}%`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Grunderwerbsteuer</TableCell>
                        <TableCell className="text-right">{formatCurrency(results.grunderwerbsteuer)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Notarkosten (1,5%)</TableCell>
                        <TableCell className="text-right">{formatCurrency(results.notarkosten)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Grundbuchkosten (0,5%)</TableCell>
                        <TableCell className="text-right">{formatCurrency(results.grundbuchkosten)}</TableCell>
                      </TableRow>
                      {results.maklerprovision > 0 && (
                        <TableRow>
                          <TableCell>Maklerprovision (3,57%)</TableCell>
                          <TableCell className="text-right">{formatCurrency(results.maklerprovision)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow className="border-t-2">
                        <TableCell className="font-semibold">Gesamte Nebenkosten</TableCell>
                        <TableCell className="text-right font-semibold text-secondary">
                          {formatCurrency(results.gesamtnebenkosten)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="p-4 rounded-lg bg-primary/10">
                    <p className="text-sm text-muted-foreground">Gesamter Kaufpreis inkl. Nebenkosten</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(results.gesamtkaufpreis)}</p>
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
      </div>
    </DashboardLayout>
  );
}
