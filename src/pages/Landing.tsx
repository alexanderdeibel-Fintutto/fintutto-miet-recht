import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, Shield, Star, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="gradient-hero text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fintutto Formulare</h1>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link to="/login">Anmelden</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/register">Registrieren</Link>
            </Button>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Deutsche Mietrecht-Formulare
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Erstellen Sie rechtskonforme Mietverträge, Kündigungen und Abrechnungen – 
            einfach, schnell und professionell.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Kostenlos starten</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="#features">Mehr erfahren</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Ihre Vorteile</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>15+ Formulare</CardTitle>
                <CardDescription>
                  Von Mietverträgen bis Nebenkostenabrechnungen – alle wichtigen Dokumente.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-shadow">
              <CardHeader>
                <Calculator className="h-12 w-12 text-primary mb-4" />
                <CardTitle>4 Rechner</CardTitle>
                <CardDescription>
                  Rendite, Finanzierung, Nebenkosten und Kaufnebenkosten berechnen.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="card-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Rechtskonform</CardTitle>
                <CardDescription>
                  Alle Formulare entsprechen dem aktuellen deutschen Mietrecht.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Preise</h3>
          <p className="text-muted-foreground text-center mb-12">
            Wählen Sie den Plan, der zu Ihnen passt
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Kostenlos
                </CardTitle>
                <CardDescription>Für den Einstieg</CardDescription>
                <div className="text-4xl font-bold mt-4">€0</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    3 Basis-Formulare
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Alle 4 Rechner
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    5 Dokumente speichern
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    PDF-Export
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/register">Kostenlos registrieren</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="card-shadow border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Beliebt
                </span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Premium
                </CardTitle>
                <CardDescription>Für Profis</CardDescription>
                <div className="text-4xl font-bold mt-4">€9,99<span className="text-lg font-normal">/Monat</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <strong>Alle</strong> 15+ Formulare
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Alle 4 Rechner
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <strong>Unbegrenzt</strong> Dokumente speichern
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Professioneller PDF-Export
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Prioritäts-Support
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link to="/register">Premium starten</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Fintutto Formulare. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
