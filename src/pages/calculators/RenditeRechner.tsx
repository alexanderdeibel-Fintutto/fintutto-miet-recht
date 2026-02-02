import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';

import { Database } from '@/integrations/supabase/types';
type Json = Database['public']['Tables']['calculations']['Insert']['input_json'];

interface RenditeInputs {
  kaufpreis: number;
  kaufnebenkosten: number;
  jahreskaltmiete: number;
  instandhaltungskosten: number;
  eigenkapital: number;
}

interface RenditeResults {
  bruttoRendite: number;
  nettoRendite: number;
  eigenkapitalRendite: number;
  gesamtInvestition: number;
}

export default function RenditeRechner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [inputs, setInputs] = useState<RenditeInputs>({
    kaufpreis: 300000,
    kaufnebenkosten: 30000,
    jahreskaltmiete: 12000,
    instandhaltungskosten: 1500,
    eigenkapital: 60000,
  });

  const [results, setResults] = useState<RenditeResults | null>(null);

  const calculate = () => {
    const gesamtInvestition = inputs.kaufpreis + inputs.kaufnebenkosten;
    const bruttoRendite = (inputs.jahreskaltmiete / gesamtInvestition) * 100;
    const nettoMiete = inputs.jahreskaltmiete - inputs.instandhaltungskosten;
    const nettoRendite = (nettoMiete / gesamtInvestition) * 100;
    const eigenkapitalRendite = (nettoMiete / inputs.eigenkapital) * 100;

    setResults({
      bruttoRendite,
      nettoRendite,
      eigenkapitalRendite,
      gesamtInvestition,
    });
  };

  const handleSave = async () => {
    if (!user || !results) return;

    const { error } = await supabase.from('calculations').insert([{
      user_id: user.id,
      title: `Rendite: ${formatCurrency(inputs.kaufpreis)}`,
      type: 'rendite' as const,
      input_json: inputs as unknown as Json,
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

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 2 }).format(value / 100);
  };

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
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <CardTitle>Renditerechner</CardTitle>
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
                  value={inputs.kaufpreis}
                  onChange={(e) => setInputs({ ...inputs, kaufpreis: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="kaufnebenkosten">Kaufnebenkosten (€)</Label>
                <Input
                  id="kaufnebenkosten"
                  type="number"
                  value={inputs.kaufnebenkosten}
                  onChange={(e) => setInputs({ ...inputs, kaufnebenkosten: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="jahreskaltmiete">Jahreskaltmiete (€)</Label>
                <Input
                  id="jahreskaltmiete"
                  type="number"
                  value={inputs.jahreskaltmiete}
                  onChange={(e) => setInputs({ ...inputs, jahreskaltmiete: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="instandhaltungskosten">Jährliche Instandhaltungskosten (€)</Label>
                <Input
                  id="instandhaltungskosten"
                  type="number"
                  value={inputs.instandhaltungskosten}
                  onChange={(e) => setInputs({ ...inputs, instandhaltungskosten: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="eigenkapital">Eigenkapital (€)</Label>
                <Input
                  id="eigenkapital"
                  type="number"
                  value={inputs.eigenkapital}
                  onChange={(e) => setInputs({ ...inputs, eigenkapital: Number(e.target.value) })}
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
              <CardDescription>Ihre Renditekennzahlen</CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Gesamtinvestition</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.gesamtInvestition)}</p>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Brutto-Rendite</p>
                      <p className="text-xl font-semibold text-primary">{formatPercent(results.bruttoRendite)}</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Netto-Rendite</p>
                      <p className="text-xl font-semibold text-success">{formatPercent(results.nettoRendite)}</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Eigenkapital-Rendite</p>
                      <p className="text-xl font-semibold text-secondary">{formatPercent(results.eigenkapitalRendite)}</p>
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
      </div>
    </DashboardLayout>
  );
}
