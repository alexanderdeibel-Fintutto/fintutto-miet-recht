import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, Receipt, Home } from 'lucide-react';

const calculators = [
  {
    id: 'rendite',
    title: 'Renditerechner',
    description: 'Berechnen Sie Brutto- und Netto-Rendite Ihrer Immobilieninvestition',
    icon: TrendingUp,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    id: 'finanzierung',
    title: 'Finanzierungsrechner',
    description: 'Ermitteln Sie monatliche Raten und erstellen Sie einen Tilgungsplan',
    icon: Wallet,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'nebenkosten',
    title: 'Nebenkostenrechner',
    description: 'Verteilen Sie Betriebskosten nach Wohnfläche auf Mieter',
    icon: Receipt,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    id: 'kaufnebenkosten',
    title: 'Kaufnebenkostenrechner',
    description: 'Berechnen Sie alle Nebenkosten beim Immobilienkauf nach Bundesland',
    icon: Home,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

export default function Rechner() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rechner</h1>
          <p className="text-muted-foreground">
            Nutzen Sie unsere spezialisierten Rechner für Ihre Immobilienberechnungen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {calculators.map((calc) => (
            <Link key={calc.id} to={`/dashboard/rechner/${calc.id}`}>
              <Card className="h-full card-shadow hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${calc.bgColor} flex items-center justify-center mb-4`}>
                    <calc.icon className={`h-6 w-6 ${calc.color}`} />
                  </div>
                  <CardTitle>{calc.title}</CardTitle>
                  <CardDescription>{calc.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
