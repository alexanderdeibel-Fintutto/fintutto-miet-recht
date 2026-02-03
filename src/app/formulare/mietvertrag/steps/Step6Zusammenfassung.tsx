'use client'

import * as React from 'react'
import { Check, AlertCircle, Edit2, FileSignature, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SignatureField, type SignatureData } from '@/components/fields/SignatureField'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MietvertragData, EMPTY_SIGNATURE } from '@/types/mietvertrag'

interface Step6Props {
  data: MietvertragData
  onChange: (updates: Partial<MietvertragData>) => void
  onEditStep: (step: number) => void
}

interface SummarySection {
  title: string
  stepIndex: number
  items: Array<{ label: string; value: string | React.ReactNode }>
  isComplete: boolean
}

export function Step6Zusammenfassung({ data, onChange, onEditStep }: Step6Props) {
  // Zusammenfassungs-Sektionen erstellen
  const sections: SummarySection[] = [
    {
      title: 'Vertragsparteien',
      stepIndex: 0,
      isComplete: !!(data.vermieter.vorname && data.mieter[0]?.vorname),
      items: [
        {
          label: 'Vermieter',
          value: data.vermieter.vorname
            ? `${data.vermieter.anrede === 'firma' ? '' : (data.vermieter.titel || '')} ${data.vermieter.vorname} ${data.vermieter.nachname}`.trim()
            : '—'
        },
        {
          label: 'Vermieter-Adresse',
          value: data.vermieterAdresse.strasse
            ? `${data.vermieterAdresse.strasse} ${data.vermieterAdresse.hausnummer}, ${data.vermieterAdresse.plz} ${data.vermieterAdresse.ort}`
            : '—'
        },
        {
          label: 'Mieter',
          value: data.mieter.map(m => `${m.vorname} ${m.nachname}`).filter(n => n.trim()).join(', ') || '—'
        },
      ]
    },
    {
      title: 'Mietobjekt',
      stepIndex: 1,
      isComplete: !!(data.objektAdresse.strasse && data.wohnflaeche),
      items: [
        {
          label: 'Adresse',
          value: data.objektAdresse.strasse
            ? `${data.objektAdresse.strasse} ${data.objektAdresse.hausnummer}, ${data.objektAdresse.plz} ${data.objektAdresse.ort}`
            : '—'
        },
        {
          label: 'Wohnfläche',
          value: data.wohnflaeche ? `${data.wohnflaeche} m²` : '—'
        },
        {
          label: 'Zimmer',
          value: data.zimmeranzahl ? `${data.zimmeranzahl} Zimmer` : '—'
        },
        {
          label: 'Zubehör',
          value: [
            data.hatBalkon && 'Balkon',
            data.hatTerrasse && 'Terrasse',
            data.hatGarten && 'Garten',
            data.hatKeller && `Keller ${data.kellerNummer || ''}`.trim(),
            data.hatStellplatz && `Stellplatz ${data.stellplatzNummer || ''}`.trim(),
            data.hatGarage && `Garage ${data.garagenNummer || ''}`.trim(),
            data.hatEinbaukueche && 'Einbauküche',
          ].filter(Boolean).join(', ') || 'Keine Angabe'
        },
      ]
    },
    {
      title: 'Mietkonditionen',
      stepIndex: 2,
      isComplete: !!(data.kaltmiete && data.nebenkostenVorauszahlung),
      items: [
        { label: 'Kaltmiete', value: data.kaltmiete ? formatCurrency(data.kaltmiete) : '—' },
        { label: 'Nebenkosten', value: data.nebenkostenVorauszahlung ? formatCurrency(data.nebenkostenVorauszahlung) : '—' },
        { label: 'Heizkosten', value: data.heizkostenVorauszahlung ? formatCurrency(data.heizkostenVorauszahlung) : '—' },
        {
          label: 'Gesamtmiete',
          value: (
            <span className="font-bold text-primary">
              {formatCurrency((data.kaltmiete || 0) + (data.nebenkostenVorauszahlung || 0) + (data.heizkostenVorauszahlung || 0))}
            </span>
          )
        },
        {
          label: 'Mietanpassung',
          value: data.staffelmiete.enabled
            ? 'Staffelmiete'
            : data.indexmiete.enabled
              ? 'Indexmiete'
              : 'Keine automatische Anpassung'
        },
      ]
    },
    {
      title: 'Mietdauer & Kaution',
      stepIndex: 3,
      isComplete: !!(data.mietdauer.startDate && data.kaution),
      items: [
        {
          label: 'Mietbeginn',
          value: data.mietdauer.startDate ? formatDate(data.mietdauer.startDate) : '—'
        },
        {
          label: 'Mietende',
          value: data.mietdauer.isUnbefristet
            ? 'Unbefristet'
            : data.mietdauer.endDate
              ? formatDate(data.mietdauer.endDate)
              : '—'
        },
        { label: 'Kaution', value: data.kaution ? formatCurrency(data.kaution) : '—' },
        {
          label: 'Kautionsart',
          value: {
            barkaution: 'Barkaution',
            sparbuch: 'Sparbuch',
            buergschaft: 'Bankbürgschaft',
            kautionsversicherung: 'Kautionsversicherung',
            '': '—'
          }[data.kautionsart] || '—'
        },
      ]
    },
    {
      title: 'Sondervereinbarungen',
      stepIndex: 4,
      isComplete: true,
      items: [
        {
          label: 'Tierhaltung',
          value: {
            erlaubt: 'Erlaubt',
            verboten: 'Verboten',
            genehmigungspflichtig: 'Genehmigungspflichtig'
          }[data.tierhaltung]
        },
        {
          label: 'Untervermietung',
          value: {
            erlaubt: 'Erlaubt',
            verboten: 'Verboten',
            genehmigungspflichtig: 'Genehmigungspflichtig'
          }[data.untervermietung]
        },
        {
          label: 'Schönheitsreparaturen',
          value: {
            keine: 'Gesetzlicher Zustand',
            mieter: 'Mieter',
            vermieter: 'Vermieter'
          }[data.schoenheitsreparaturen]
        },
        {
          label: 'Kleinreparaturen',
          value: data.kleinreparaturen.enabled
            ? `Bis ${formatCurrency(data.kleinreparaturen.einzelbetrag || 0)} / max. ${formatCurrency(data.kleinreparaturen.jahresbetrag || 0)} p.a.`
            : 'Keine Übertragung'
        },
      ]
    }
  ]

  const allComplete = sections.every(s => s.isComplete)
  const incompleteCount = sections.filter(s => !s.isComplete).length

  // Unterschriften aktualisieren
  const handleVermieterSignature = (signature: SignatureData) => {
    onChange({ unterschriftVermieter: signature })
  }

  const handleMieterSignature = (index: number, signature: SignatureData) => {
    const newSignatures = [...data.unterschriftMieter]
    newSignatures[index] = signature
    onChange({ unterschriftMieter: newSignatures })
  }

  // Sicherstellen, dass genug Unterschriftsfelder vorhanden sind
  React.useEffect(() => {
    if (data.unterschriftMieter.length < data.mieter.length) {
      const newSignatures = [...data.unterschriftMieter]
      while (newSignatures.length < data.mieter.length) {
        newSignatures.push({ ...EMPTY_SIGNATURE })
      }
      onChange({ unterschriftMieter: newSignatures })
    }
  }, [data.mieter.length])

  return (
    <div className="space-y-8">
      {/* Status-Übersicht */}
      <div className={`p-4 rounded-lg border ${allComplete ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center gap-3">
          {allComplete ? (
            <Check className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          )}
          <div>
            <p className={`font-medium ${allComplete ? 'text-green-800' : 'text-yellow-800'}`}>
              {allComplete
                ? 'Alle Angaben vollständig'
                : `${incompleteCount} Abschnitt(e) unvollständig`
              }
            </p>
            <p className={`text-sm ${allComplete ? 'text-green-600' : 'text-yellow-600'}`}>
              {allComplete
                ? 'Sie können den Mietvertrag jetzt unterschreiben und erstellen'
                : 'Bitte vervollständigen Sie die markierten Abschnitte'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Zusammenfassungs-Sektionen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className={!section.isComplete ? 'border-yellow-300' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  {section.isComplete ? (
                    <Badge variant="success" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      OK
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Unvollständig
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(section.stepIndex)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Bearbeiten
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {section.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <dt className="text-muted-foreground">{item.label}:</dt>
                    <dd className="font-medium text-right max-w-[60%]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Unterschriften */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileSignature className="h-5 w-5" />
          Unterschriften
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vermieter-Unterschrift */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vermieter</CardTitle>
            </CardHeader>
            <CardContent>
              <SignatureField
                value={{
                  ...data.unterschriftVermieter,
                  signerName: data.unterschriftVermieter.signerName ||
                    `${data.vermieter.vorname} ${data.vermieter.nachname}`.trim()
                }}
                onChange={handleVermieterSignature}
                label="Unterschrift Vermieter"
                required
              />
            </CardContent>
          </Card>

          {/* Mieter-Unterschriften */}
          {data.mieter.map((mieter, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">
                  {data.mieter.length > 1 ? `Mieter ${index + 1}` : 'Mieter'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SignatureField
                  value={{
                    ...(data.unterschriftMieter[index] || EMPTY_SIGNATURE),
                    signerName: data.unterschriftMieter[index]?.signerName ||
                      `${mieter.vorname} ${mieter.nachname}`.trim()
                  }}
                  onChange={(sig) => handleMieterSignature(index, sig)}
                  label={`Unterschrift ${mieter.vorname} ${mieter.nachname}`.trim() || 'Unterschrift Mieter'}
                  required
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Hinweise */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Nach Abschluss</p>
              <ul className="list-disc list-inside text-blue-600 mt-1 space-y-1">
                <li>Der Mietvertrag wird als PDF heruntergeladen</li>
                <li>Beide Parteien erhalten je ein unterschriebenes Exemplar</li>
                <li>Bewahren Sie den Vertrag sicher auf</li>
                <li>Ein Übergabeprotokoll bei Einzug wird empfohlen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
