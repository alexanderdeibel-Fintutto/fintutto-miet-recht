import { PropertyLayout } from '@/components/PropertyLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

export default function Meters() {
  return (
    <PropertyLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Zähler</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Zähler und Ablesungen
          </p>
        </div>
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Zähler</CardTitle>
            <CardDescription>
              Diese Funktion wird in Kürze verfügbar sein.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PropertyLayout>
  );
}
