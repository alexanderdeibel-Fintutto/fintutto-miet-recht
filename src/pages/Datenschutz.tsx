import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function Datenschutz() {
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
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h1 className="font-semibold">Datenschutzerklärung</h1>
                <p className="text-sm text-muted-foreground">
                  Informationen zum Datenschutz
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Ihre Daten bleiben bei Ihnen</p>
                  <p className="mt-1">
                    Alle Formulardaten werden ausschließlich lokal in Ihrem Browser
                    gespeichert. Es werden keine personenbezogenen Daten an unsere
                    Server übermittelt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Datenschutz auf einen Blick</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Allgemeine Hinweise</h4>
                <p className="text-sm text-muted-foreground">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                  Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                  werden können.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Datenerfassung auf dieser Website</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
                  <br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                  Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Hosting und Content Delivery Networks (CDN)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die
                personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf
                den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen,
                Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten,
                Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert
                werden, handeln.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Allgemeine Hinweise und Pflichtinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Datenschutz</h4>
                <p className="text-sm text-muted-foreground">
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                  ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
                  der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Hinweis zur verantwortlichen Stelle</h4>
                <p className="text-sm text-muted-foreground">
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Mietrecht Formulare<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  E-Mail: kontakt@mietrecht-formulare.de
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Datenerfassung auf dieser Website</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Lokale Speicherung (Local Storage)</h4>
                <p className="text-sm text-muted-foreground">
                  Diese Website verwendet die lokale Speicherung Ihres Browsers (Local Storage),
                  um von Ihnen eingegebene Formulardaten zu speichern. Diese Daten verlassen
                  niemals Ihren Browser und werden nicht an unsere oder andere Server übertragen.
                  Sie können diese Daten jederzeit in den Browsereinstellungen löschen.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Server-Log-Dateien</h4>
                <p className="text-sm text-muted-foreground">
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in
                  so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns
                  übermittelt. Dies sind:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>Verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Ihre Rechte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
                gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den
                Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung
                dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können
                Sie sich jederzeit an uns wenden.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-semibold text-sm mb-2">Auskunftsrecht</h5>
                  <p className="text-xs text-muted-foreground">
                    Sie haben das Recht, Auskunft über Ihre gespeicherten Daten zu verlangen.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-semibold text-sm mb-2">Berichtigungsrecht</h5>
                  <p className="text-xs text-muted-foreground">
                    Sie haben das Recht, unrichtige Daten berichtigen zu lassen.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-semibold text-sm mb-2">Löschungsrecht</h5>
                  <p className="text-xs text-muted-foreground">
                    Sie haben das Recht, Ihre Daten löschen zu lassen.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h5 className="font-semibold text-sm mb-2">Widerspruchsrecht</h5>
                  <p className="text-xs text-muted-foreground">
                    Sie haben das Recht, der Datenverarbeitung zu widersprechen.
                  </p>
                </div>
              </div>
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
