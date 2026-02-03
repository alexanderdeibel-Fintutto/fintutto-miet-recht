import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  HelpCircle,
  Search,
  BookOpen,
  FileText,
  Calculator,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Shield,
  Download,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface FAQ {
  frage: string
  antwort: string
  kategorie: string
}

const faqs: FAQ[] = [
  {
    frage: 'Wie erstelle ich einen Mietvertrag?',
    antwort: 'Klicken Sie auf der Startseite auf "Mietvertrag erstellen" oder wählen Sie das Formular aus der Übersicht. Der Wizard führt Sie in 6 Schritten durch alle notwendigen Angaben. Am Ende können Sie das fertige Dokument als PDF herunterladen.',
    kategorie: 'formulare'
  },
  {
    frage: 'Was bedeutet die KI-Unterstützung?',
    antwort: 'Bei jedem Formularfeld finden Sie ein Hilfssymbol mit einem Fragezeichen. Klicken Sie darauf, um kontextbezogene Erklärungen, rechtliche Hinweise mit Paragraphenangaben und Ausfüllvorschläge zu erhalten.',
    kategorie: 'ki'
  },
  {
    frage: 'Sind die Formulare rechtssicher?',
    antwort: 'Unsere Formulare basieren auf aktueller Rechtsprechung und werden regelmäßig von Rechtsexperten geprüft. Sie enthalten alle wichtigen Pflichtangaben gemäß BGB. Für individuelle Rechtsfragen empfehlen wir jedoch die Beratung durch einen Fachanwalt.',
    kategorie: 'rechtlich'
  },
  {
    frage: 'Wie funktioniert der Kündigungsfrist-Rechner?',
    antwort: 'Geben Sie einfach den Mietbeginn und das gewünschte Kündigungsdatum ein. Der Rechner berechnet automatisch die korrekte Kündigungsfrist nach § 573c BGB unter Berücksichtigung der Mietdauer (3, 6 oder 9 Monate).',
    kategorie: 'rechner'
  },
  {
    frage: 'Kann ich meine Dokumente speichern und später bearbeiten?',
    antwort: 'Ja, Ihre Dokumente werden automatisch in Ihrem Browser gespeichert. Unter "Meine Dokumente" finden Sie alle erstellten Formulare und können diese jederzeit bearbeiten, duplizieren oder als PDF exportieren.',
    kategorie: 'dokumente'
  },
  {
    frage: 'Was ist bei der Kaution zu beachten?',
    antwort: 'Die Kaution darf maximal 3 Monatskaltmieten betragen (§ 551 BGB). Der Mieter hat das Recht, die Kaution in 3 Monatsraten zu zahlen. Der Vermieter muss die Kaution getrennt vom eigenen Vermögen anlegen.',
    kategorie: 'rechtlich'
  },
  {
    frage: 'Wie funktioniert die digitale Unterschrift?',
    antwort: 'Im letzten Schritt jedes Formulars können Sie mit der Maus oder dem Finger direkt im Unterschriftenfeld unterschreiben. Die Unterschrift wird als Bild im PDF eingebettet.',
    kategorie: 'formulare'
  },
  {
    frage: 'Was ist die Kappungsgrenze bei Mieterhöhungen?',
    antwort: 'Die Miete darf innerhalb von 3 Jahren nicht um mehr als 20% steigen (§ 558 Abs. 3 BGB). In Gebieten mit angespanntem Wohnungsmarkt kann die Grenze auf 15% reduziert sein.',
    kategorie: 'rechtlich'
  },
]

const kategorien = [
  { id: 'alle', label: 'Alle Themen', icon: BookOpen },
  { id: 'formulare', label: 'Formulare', icon: FileText },
  { id: 'rechner', label: 'Rechner', icon: Calculator },
  { id: 'ki', label: 'KI-Unterstützung', icon: Sparkles },
  { id: 'rechtlich', label: 'Rechtliches', icon: Shield },
  { id: 'dokumente', label: 'Dokumente', icon: FileText },
]

const schnelllinks = [
  { label: 'Mietvertrag erstellen', href: '/formulare/mietvertrag', icon: FileText },
  { label: 'Kündigung erstellen', href: '/formulare/kuendigung', icon: FileText },
  { label: 'Kündigungsfrist berechnen', href: '/rechner/kuendigungsfrist', icon: Calculator },
  { label: 'Kaution berechnen', href: '/rechner/kaution', icon: Calculator },
  { label: 'Meine Dokumente', href: '/meine-dokumente', icon: FileText },
]

export default function Hilfe() {
  const [suchbegriff, setSuchbegriff] = useState('')
  const [aktiveKategorie, setAktiveKategorie] = useState('alle')
  const [offeneFragen, setOffeneFragen] = useState<string[]>([])

  const gefilterteFaqs = faqs.filter(faq => {
    const matchSuche = faq.frage.toLowerCase().includes(suchbegriff.toLowerCase()) ||
                       faq.antwort.toLowerCase().includes(suchbegriff.toLowerCase())
    const matchKategorie = aktiveKategorie === 'alle' || faq.kategorie === aktiveKategorie
    return matchSuche && matchKategorie
  })

  const toggleFrage = (frage: string) => {
    setOffeneFragen(prev =>
      prev.includes(frage)
        ? prev.filter(f => f !== frage)
        : [...prev, frage]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <HelpCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h1 className="font-semibold">Hilfe & Support</h1>
                <p className="text-sm text-muted-foreground">Antworten auf Ihre Fragen</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Wie können wir helfen?</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Suchen Sie nach Hilfe..."
              value={suchbegriff}
              onChange={(e) => setSuchbegriff(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Kategorien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {kategorien.map((kat) => (
                  <Button
                    key={kat.id}
                    variant={aktiveKategorie === kat.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2 h-auto py-2"
                    onClick={() => setAktiveKategorie(kat.id)}
                  >
                    <kat.icon className="h-4 w-4" />
                    <span className="text-sm">{kat.label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Schnellzugriff</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {schnelllinks.map((link) => (
                  <Link key={link.href} to={link.href}>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2">
                      <link.icon className="h-4 w-4" />
                      <span className="text-sm">{link.label}</span>
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-900">Noch Fragen?</p>
                    <p className="text-green-700 mt-1">Kontaktieren Sie uns per E-Mail.</p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      support@mietrecht-formulare.de
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm">KI-Unterstützung</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Intelligente Ausfüllhilfe für alle Felder
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="mx-auto w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-sm">Rechtssicher</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Basierend auf aktuellem BGB
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="mx-auto w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Download className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-sm">PDF-Export</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Professionelle Dokumente zum Ausdrucken
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Häufig gestellte Fragen</CardTitle>
                <CardDescription>{gefilterteFaqs.length} Fragen gefunden</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {gefilterteFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Keine passenden Fragen gefunden.</p>
                  </div>
                ) : (
                  gefilterteFaqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg">
                      <button
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        onClick={() => toggleFrage(faq.frage)}
                      >
                        <span className="font-medium pr-4">{faq.frage}</span>
                        {offeneFragen.includes(faq.frage) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {offeneFragen.includes(faq.frage) && (
                        <div className="px-4 pb-4">
                          <Separator className="mb-3" />
                          <p className="text-sm text-muted-foreground">{faq.antwort}</p>
                          <Badge variant="secondary" className="mt-3">
                            {kategorien.find(k => k.id === faq.kategorie)?.label}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schritt-für-Schritt Anleitungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Mietvertrag erstellen
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Formular "Mietvertrag" auswählen</li>
                        <li>Vertragsparteien eingeben</li>
                        <li>Mietobjekt beschreiben</li>
                        <li>Konditionen festlegen</li>
                        <li>Unterschreiben & PDF exportieren</li>
                      </ol>
                      <Link to="/formulare/mietvertrag">
                        <Button size="sm" variant="outline" className="mt-3">
                          Jetzt starten
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Kündigungsfrist berechnen
                      </h4>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Rechner öffnen</li>
                        <li>Mietbeginn eingeben</li>
                        <li>Gewünschtes Datum wählen</li>
                        <li>Ergebnis ablesen</li>
                        <li>Optional: Kündigung erstellen</li>
                      </ol>
                      <Link to="/rechner/kuendigungsfrist">
                        <Button size="sm" variant="outline" className="mt-3">
                          Zum Rechner
                          <ExternalLink className="h-3 w-3 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Rechtlicher Hinweis</p>
                    <p className="mt-1">
                      Diese Formulare dienen als Orientierungshilfe und ersetzen keine individuelle
                      Rechtsberatung. Bei komplexen Sachverhalten empfehlen wir die Beratung durch
                      einen Fachanwalt für Mietrecht.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
