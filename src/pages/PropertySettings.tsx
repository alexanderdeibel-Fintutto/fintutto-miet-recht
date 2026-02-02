import { PropertyLayout } from '@/components/PropertyLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function PropertySettings() {
  return (
    <PropertyLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Einstellungen</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Organisationseinstellungen
          </p>
        </div>
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Einstellungen</CardTitle>
            <CardDescription>
              Diese Funktion wird in Kürze verfügbar sein.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PropertyLayout>
  );
}
