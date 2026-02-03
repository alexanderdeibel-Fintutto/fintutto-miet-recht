'use client'

import Link from 'next/link'
import { ArrowLeft, Building2, Mail, Phone, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
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
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Betreiber</h3>
                <p className="text-muted-foreground">
                  Mietrecht Formulare GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Kontakt</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +49 (0) 123 456789
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    info@mietrecht-formulare.de
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    www.mietrecht-formulare.de
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Vertretungsberechtigte</h3>
                <p className="text-muted-foreground">
                  Geschäftsführer: Max Mustermann
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Registereintrag</h3>
                <p className="text-muted-foreground">
                  Eintragung im Handelsregister<br />
                  Registergericht: Amtsgericht Musterstadt<br />
                  Registernummer: HRB 12345
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Umsatzsteuer-ID</h3>
                <p className="text-muted-foreground">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                  DE123456789
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Haftungsausschluss</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Haftung für Inhalte</h3>
                <p className="text-sm text-muted-foreground">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
                  Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch
                  keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
                  für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                  verantwortlich.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Haftung für Links</h3>
                <p className="text-sm text-muted-foreground">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
                  wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
                  keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
                  jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Urheberrecht</h3>
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
                <strong>Hinweis:</strong> Die Formulare auf dieser Website dienen als
                Orientierungshilfe und ersetzen keine individuelle Rechtsberatung. Bei
                rechtlichen Fragen wenden Sie sich bitte an einen Fachanwalt.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
