'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Cookie, Database, Lock, Eye, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-semibold">Datenschutzerklärung</h1>
                <p className="text-sm text-muted-foreground">
                  Gemäß DSGVO
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Übersicht */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4 text-center">
                <Lock className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold text-sm">Lokale Speicherung</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ihre Daten bleiben auf Ihrem Gerät
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 text-center">
                <Eye className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm">Keine Weitergabe</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Keine Daten an Dritte
                </p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4 text-center">
                <Database className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm">Minimale Erfassung</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Nur notwendige Daten
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Datenschutz auf einen Blick</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Allgemeine Hinweise</h3>
                <p className="text-sm text-muted-foreground">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                  Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                  werden können.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Datenerfassung auf dieser Website</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Wer ist verantwortlich für die Datenerfassung?</strong><br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
                  Dessen Kontaktdaten können Sie dem Impressum entnehmen.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Wie erfassen wir Ihre Daten?</h3>
                <p className="text-sm text-muted-foreground">
                  Die Formulardaten, die Sie in unsere Mietrecht-Formulare eingeben, werden
                  ausschließlich lokal in Ihrem Browser gespeichert (localStorage). Diese Daten
                  werden nicht an unsere Server übermittelt.
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
                Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser
                Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei
                kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
                Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über
                eine Website generiert werden, handeln.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Allgemeine Hinweise und Pflichtinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Datenschutz</h3>
                <p className="text-sm text-muted-foreground">
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                  ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
                  der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Hinweis zur verantwortlichen Stelle</h3>
                <p className="text-sm text-muted-foreground">
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
                  Mietrecht Formulare GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br /><br />
                  E-Mail: datenschutz@mietrecht-formulare.de
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Widerruf Ihrer Einwilligung</h3>
                <p className="text-sm text-muted-foreground">
                  Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung
                  möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen.
                  Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom
                  Widerruf unberührt.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                4. Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Diese Website verwendet technisch notwendige Cookies. Diese Cookies sind
                erforderlich, damit die Website ordnungsgemäß funktioniert.
              </p>

              <div>
                <h3 className="font-semibold mb-2">Welche Cookies setzen wir ein?</h3>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Session-Cookies für die Funktionalität der Website</li>
                  <li>LocalStorage für die Speicherung Ihrer Formulardaten</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Keine Tracking-Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  Wir setzen keine Tracking-Cookies oder Analyse-Tools von Drittanbietern ein.
                  Ihre Nutzung der Website wird nicht zu Werbezwecken analysiert.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Datenerfassung bei Formularnutzung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Lokale Datenspeicherung</h3>
                <p className="text-sm text-muted-foreground">
                  Wenn Sie unsere Mietrecht-Formulare ausfüllen, werden die eingegebenen Daten
                  ausschließlich lokal in Ihrem Browser (localStorage) gespeichert. Diese Daten
                  werden nicht an unsere Server übertragen.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">PDF-Generierung</h3>
                <p className="text-sm text-muted-foreground">
                  Die PDF-Erstellung erfolgt direkt in Ihrem Browser. Ihre Formulardaten verlassen
                  dabei nicht Ihr Gerät.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Datenlöschung</h3>
                <p className="text-sm text-muted-foreground">
                  Sie können Ihre gespeicherten Formulardaten jederzeit über "Meine Dokumente"
                  löschen oder durch Löschen der Browser-Daten entfernen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Ihre Rechte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden
                personenbezogenen Daten:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Fragen zum Datenschutz?</p>
                  <p className="mt-1">
                    Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen
                    Daten wenden Sie sich bitte an:<br />
                    <strong>datenschutz@mietrecht-formulare.de</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
