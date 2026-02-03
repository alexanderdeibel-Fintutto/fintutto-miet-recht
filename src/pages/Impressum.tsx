import { Link } from 'react-router-dom'
import { ArrowLeft, Building2, Mail, Phone, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
              <div className="p-2 bg-slate-100 rounded-lg">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h1 className="font-semibold">Impressum</h1>
                <p className="text-sm text-muted-foreground">
                  Angaben gemäß § 5 TMG
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Angaben gemäß § 5 TMG</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Mietrecht Formulare</p>
                <p className="text-muted-foreground">Musterstraße 123</p>
                <p className="text-muted-foreground">12345 Musterstadt</p>
                <p className="text-muted-foreground">Deutschland</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+49 (0) 123 456789</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>kontakt@mietrecht-formulare.de</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>www.mietrecht-formulare.de</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Max Mustermann</p>
              <p className="text-muted-foreground">Musterstraße 123</p>
              <p className="text-muted-foreground">12345 Musterstadt</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Haftungsausschluss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Haftung für Inhalte</h4>
                <p className="text-sm text-muted-foreground">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                  Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
                  keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG
                  für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Haftung für Links</h4>
                <p className="text-sm text-muted-foreground">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte
                  wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
                  keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
                  jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Urheberrecht</h4>
                <p className="text-sm text-muted-foreground">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                  unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                  Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
                  Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors
                  bzw. Erstellers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <p className="text-sm text-amber-800">
                <strong>Hinweis:</strong> Die bereitgestellten Formulare und Informationen
                stellen keine Rechtsberatung dar. Bei konkreten Rechtsfragen wenden Sie sich
                bitte an einen Rechtsanwalt.
              </p>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground text-center">
            Stand: Januar 2024
          </p>
        </div>
      </main>
    </div>
  )
}
