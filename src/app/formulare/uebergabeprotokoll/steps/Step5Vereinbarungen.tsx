'use client'

import * as React from 'react'
import { FileText, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  UebergabeprotokollData,
  ZustandBewertung,
  ZUSTAND_LABELS,
  ZUSTAND_COLORS
} from '@/types/uebergabeprotokoll'
import { cn } from '@/lib/utils'

interface Step5Props {
  data: UebergabeprotokollData
  onChange: (updates: Partial<UebergabeprotokollData>) => void
}

const REINIGUNG_OPTIONS = [
  { value: 'gereinigt', label: 'Vollständig gereinigt', description: 'Professionelle Reinigung oder gründliche Endreinigung' },
  { value: 'besenrein', label: 'Besenrein', description: 'Grob gereinigt, keine groben Verschmutzungen' },
  { value: 'nicht_gereinigt', label: 'Nicht gereinigt', description: 'Reinigung noch erforderlich' },
]

export function Step5Vereinbarungen({ data, onChange }: Step5Props) {
  // Mängel aus Raumerfassung sammeln
  const gesammelteManngel = data.raeume
    .filter(raum => raum.sonstigesMaengel || Object.values(raum).includes('maengel'))
    .map(raum => ({
      raum: raum.raumname,
      maengel: raum.sonstigesMaengel || 'Mängel vorhanden (siehe Zustandserfassung)'
    }))

  return (
    <div className="space-y-8">
      {/* Allgemeiner Zustand */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Allgemeiner Zustand</CardTitle>
          <CardDescription>
            Gesamtbewertung der Wohnung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-3 block">Allgemeinzustand der Wohnung</Label>
            <RadioGroup
              value={data.allgemeinerZustand}
              onValueChange={(v) => onChange({ allgemeinerZustand: v as ZustandBewertung })}
              className="grid grid-cols-2 md:grid-cols-5 gap-2"
            >
              {(['sehr_gut', 'gut', 'normal', 'maengel'] as ZustandBewertung[]).map((zustand) => (
                <div key={zustand}>
                  <RadioGroupItem value={zustand} id={`zustand-${zustand}`} className="peer sr-only" />
                  <Label
                    htmlFor={`zustand-${zustand}`}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-md border-2 p-3 cursor-pointer transition-colors",
                      "peer-data-[state=checked]:border-primary",
                      ZUSTAND_COLORS[zustand]
                    )}
                  >
                    {zustand === 'sehr_gut' || zustand === 'gut' ? (
                      <CheckCircle2 className="h-5 w-5 mb-1" />
                    ) : zustand === 'maengel' ? (
                      <AlertCircle className="h-5 w-5 mb-1" />
                    ) : null}
                    <span className="text-sm font-medium">{ZUSTAND_LABELS[zustand]}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          <div>
            <Label className="mb-3 block">Reinigungszustand</Label>
            <RadioGroup
              value={data.reinigungszustand}
              onValueChange={(v) => onChange({ reinigungszustand: v as 'gereinigt' | 'besenrein' | 'nicht_gereinigt' })}
              className="space-y-2"
            >
              {REINIGUNG_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`reinigung-${option.value}`} />
                  <Label htmlFor={`reinigung-${option.value}`} className="cursor-pointer flex-1">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-sm text-muted-foreground ml-2">– {option.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Festgestellte Mängel */}
      {gesammelteManngel.length > 0 && (
        <Card className="border-yellow-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-lg">Festgestellte Mängel</CardTitle>
            </div>
            <CardDescription>
              Aus der Zustandserfassung übernommen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gesammelteManngel.map((item, index) => (
                <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-medium text-yellow-800">{item.raum}</p>
                  <p className="text-sm text-yellow-700">{item.maengel}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mängelbeseitigung */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vereinbarungen zur Mängelbeseitigung</CardTitle>
          <CardDescription>
            Wer beseitigt welche Mängel bis wann?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.maengelbeseitigung || ''}
            onChange={(e) => onChange({ maengelbeseitigung: e.target.value })}
            placeholder="z.B. Der Vermieter lässt die Beschädigung an der Badezimmertür bis zum 15.03.2024 reparieren. Der Mieter übernimmt das Streichen des Wohnzimmers in neutraler Farbe."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Kostenübernahme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kostenübernahme</CardTitle>
          <CardDescription>
            Wer trägt welche Kosten?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.kostenuebernahme || ''}
            onChange={(e) => onChange({ kostenuebernahme: e.target.value })}
            placeholder="z.B. Die Kosten für die Reparatur der Heizung trägt der Vermieter. Die Reinigungskosten trägt der Mieter."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Sonstige Vereinbarungen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sonstige Vereinbarungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.vereinbarungen || ''}
            onChange={(e) => onChange({ vereinbarungen: e.target.value })}
            placeholder="z.B. Der Mieter hinterlässt die Einbauküche, die vom neuen Mieter übernommen wird. Ablöse: 500 €"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Hinweis */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Tipp</p>
              <p className="text-blue-600">
                Halten Sie alle Vereinbarungen schriftlich fest. Das Übergabeprotokoll dient
                als Beweismittel und kann bei Streitigkeiten über die Kaution entscheidend sein.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
