import { PropertyLayout } from '@/components/PropertyLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function Messages() {
  return (
    <PropertyLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Nachrichten</h2>
          <p className="text-muted-foreground">
            Kommunizieren Sie mit Ihren Mietern
          </p>
        </div>
        <Card className="border-dashed">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Nachrichten</CardTitle>
            <CardDescription>
              Diese Funktion wird in Kürze verfügbar sein.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PropertyLayout>
  );
}
