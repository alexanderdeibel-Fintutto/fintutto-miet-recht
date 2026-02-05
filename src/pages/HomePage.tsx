import { Link } from 'react-router-dom'
import {
  FileText,
  Calculator,
  Home,
  FileSignature,
  Euro,
  Building2,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FormulareSection } from '@/components/home/FormulareSection'

const rechner = [
  {
    id: 'mietpreis',
    title: 'Mietpreisrechner',
    description: 'Ortsübliche Vergleichsmiete ermitteln',
    icon: Building2,
    href: '/rechner/mietpreis',
  },
  {
    id: 'nebenkosten',
    title: 'Nebenkostenrechner',
    description: 'Monatliche Vorauszahlung kalkulieren',
    icon: Calculator,
    href: '/rechner/nebenkosten',
  },
  {
    id: 'kaution',
    title: 'Kautionsrechner',
    description: 'Maximale Kaution und Zinsen berechnen',
    icon: Euro,
    href: '/rechner/kaution',
  },
  {
    id: 'kuendigungsfrist',
    title: 'Kündigungsfrist-Rechner',
    description: 'Kündigungsfrist nach Wohndauer ermitteln',
    icon: FileText,
    href: '/rechner/kuendigungsfrist',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mietrecht Formulare</h1>
                <p className="text-sm text-muted-foreground">Professionell & rechtssicher</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/meine-dokumente">
                <Button variant="ghost">Meine Dokumente</Button>
              </Link>
              <Link to="/hilfe">
                <Button variant="ghost">Hilfe</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            Mit KI-Unterstützung
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Mietrecht-Formulare einfach erstellen
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Professionelle Mietverträge, Kündigungen und mehr - rechtssicher und
            mit intelligenter Ausfüllhilfe. Schritt für Schritt zum fertigen Dokument.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/formulare/mietvertrag">
              <Button size="lg" className="gap-2">
                <FileSignature className="h-5 w-5" />
                Mietvertrag erstellen
              </Button>
            </Link>
            <Link to="/formulare">
              <Button size="lg" variant="outline">
                Alle Formulare ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Formulare Section - Limited preview on homepage */}
      <FormulareSection limit={8} showSearch={false} showFilters={false} />

      {/* Rechner Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">Rechner & Tools</h3>
          <p className="text-muted-foreground">
            Praktische Rechner für wichtige Mietrecht-Berechnungen
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rechner.map((tool) => (
            <Link key={tool.id} to={tool.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="p-2 bg-secondary rounded-lg w-fit group-hover:bg-secondary/80 transition-colors">
                    <tool.icon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">Warum unsere Formulare?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">KI-Unterstützung</h4>
            <p className="text-muted-foreground text-sm">
              Intelligente Ausfüllhilfe erklärt jedes Feld und schlägt passende Formulierungen vor
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Rechtssicher</h4>
            <p className="text-muted-foreground text-sm">
              Alle Formulare entsprechen der aktuellen Rechtsprechung und werden regelmäßig aktualisiert
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Professioneller PDF-Export</h4>
            <p className="text-muted-foreground text-sm">
              Fertige Dokumente im professionellen Layout zum Ausdrucken oder digitalen Versand
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Mietrecht Formulare. Alle Rechte vorbehalten.
            </div>
            <div className="flex gap-4 text-sm">
              <Link to="/impressum" className="text-muted-foreground hover:text-foreground">
                Impressum
              </Link>
              <Link to="/datenschutz" className="text-muted-foreground hover:text-foreground">
                Datenschutz
              </Link>
              <Link to="/agb" className="text-muted-foreground hover:text-foreground">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
