'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle2, AlertTriangle, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h1 className="font-semibold">Allgemeine Geschäftsbedingungen</h1>
                <p className="text-sm text-muted-foreground">
                  Nutzungsbedingungen
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
              <CardTitle>§ 1 Geltungsbereich</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der
                Website "Mietrecht Formulare" und der darauf angebotenen Dienste.
              </p>
              <p className="text-sm text-muted-foreground">
                (2) Abweichende, entgegenstehende oder ergänzende AGB werden nicht
                Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich
                zugestimmt.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>§ 2 Leistungsbeschreibung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                (1) Wir bieten Online-Formulare und Rechner für mietrechtliche Dokumente an.
                Diese umfassen insbesondere:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-4">
                <li>Mietvertragsvorlagen</li>
                <li>Kündigungsschreiben</li>
                <li>Übergabeprotokolle</li>
                <li>Betriebskostenabrechnungen</li>
                <li>Mieterhöhungsverlangen</li>
                <li>Diverse Rechner (Kaution, Kündigungsfrist, etc.)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                (2) Die Formulare dienen als Orientierungshilfe und Vorlage. Sie stellen keine
                individuelle Rechtsberatung dar.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                § 3 Wichtiger Haftungsausschluss
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-amber-800">
                (1) <strong>Keine Rechtsberatung:</strong> Die bereitgestellten Formulare und
                Informationen ersetzen keine individuelle Rechtsberatung durch einen
                Rechtsanwalt.
              </p>
              <p className="text-sm text-amber-800">
                (2) <strong>Keine Gewähr:</strong> Obwohl wir uns um Aktualität und Richtigkeit
                bemühen, übernehmen wir keine Gewähr für die Vollständigkeit, Aktualität und
                Richtigkeit der bereitgestellten Formulare und Informationen.
              </p>
              <p className="text-sm text-amber-800">
                (3) <strong>Haftungsbeschränkung:</strong> Eine Haftung für Schäden, die durch
                die Nutzung der Formulare entstehen, ist ausgeschlossen, soweit gesetzlich
                zulässig.
              </p>
              <p className="text-sm text-amber-800">
                (4) <strong>Empfehlung:</strong> Bei komplexen Sachverhalten oder
                Streitigkeiten empfehlen wir dringend die Beratung durch einen Fachanwalt für
                Mietrecht.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>§ 4 Nutzungsrechte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                (1) Die Nutzung der Formulare ist für private Zwecke gestattet.
              </p>
              <p className="text-sm text-muted-foreground">
                (2) Eine gewerbliche Nutzung, insbesondere der Weiterverkauf oder die
                kommerzielle Weitergabe der Formulare, ist ohne ausdrückliche schriftliche
                Genehmigung nicht gestattet.
              </p>
              <p className="text-sm text-muted-foreground">
                (3) Die erstellten PDF-Dokumente dürfen für den persönlichen Gebrauch
                verwendet, ausgedruckt und weitergegeben werden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>§ 5 Datenschutz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                (1) Die in Formulare eingegebenen Daten werden ausschließlich lokal im Browser
                des Nutzers gespeichert.
              </p>
              <p className="text-sm text-muted-foreground">
                (2) Eine Übermittlung personenbezogener Daten an unsere Server findet nicht
                statt.
              </p>
              <p className="text-sm text-muted-foreground">
                (3) Weitere Informationen entnehmen Sie bitte unserer{' '}
                <Link href="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>§ 6 Verfügbarkeit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                (1) Wir bemühen uns um eine ständige Verfügbarkeit der Website, können diese
                jedoch nicht garantieren.
              </p>
              <p className="text-sm text-muted-foreground">
                (2) Wir behalten uns vor, die Website jederzeit ohne Vorankündigung zu ändern,
                zu ergänzen oder einzustellen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>§ 7 Änderungen der AGB</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Wir behalten uns vor, diese AGB jederzeit zu ändern. Die jeweils aktuelle
                Version ist auf der Website abrufbar. Durch die weitere Nutzung der Website
                nach Änderung der AGB erklären Sie sich mit den geänderten AGB einverstanden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>§ 8 Schlussbestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
                UN-Kaufrechts.
              </p>
              <p className="text-sm text-muted-foreground">
                (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden,
                bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
              <p className="text-sm text-muted-foreground">
                (3) Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Betreibers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Zusammenfassung</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Kostenlose Nutzung für private Zwecke</li>
                    <li>• Keine Rechtsberatung - nur Formularhilfe</li>
                    <li>• Daten bleiben lokal auf Ihrem Gerät</li>
                    <li>• Bei Rechtsfragen: Anwalt konsultieren</li>
                  </ul>
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
