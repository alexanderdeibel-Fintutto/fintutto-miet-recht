// Typen für das Übergabeprotokoll
import { AddressData, PersonData, SignatureData } from '@/components/fields'

export type ZustandBewertung = 'sehr_gut' | 'gut' | 'normal' | 'maengel' | 'nicht_vorhanden'

export interface ZaehlerstandData {
  zaehlerart: 'strom' | 'gas' | 'wasser' | 'heizung' | 'warmwasser'
  zaehlernummer: string
  stand: number | null
  einheit: string
  ablesedatum: string
  foto?: string
}

export interface SchluesselData {
  art: string
  anzahlUebergeben: number
  anzahlVorhanden: number
  bemerkung?: string
}

export interface RaumZustandData {
  raumname: string
  raumtyp: 'wohnzimmer' | 'schlafzimmer' | 'kinderzimmer' | 'kueche' | 'bad' | 'wc' | 'flur' | 'abstellraum' | 'keller' | 'balkon' | 'terrasse' | 'sonstige'
  waende: ZustandBewertung
  waendeBemerkung?: string
  decke: ZustandBewertung
  deckeBemerkung?: string
  boden: ZustandBewertung
  bodenBemerkung?: string
  bodenart?: string
  fenster: ZustandBewertung
  fensterBemerkung?: string
  fensterAnzahl?: number
  tueren: ZustandBewertung
  tuerenBemerkung?: string
  heizkoerper: ZustandBewertung
  heizkoerperBemerkung?: string
  heizkoerperAnzahl?: number
  steckdosen: ZustandBewertung
  steckdosenBemerkung?: string
  steckdosenAnzahl?: number
  beleuchtung: ZustandBewertung
  beleuchtungBemerkung?: string
  sonstigesMaengel?: string
  fotos?: string[]
}

export interface UebergabeprotokollData {
  // Grunddaten
  protokollart: 'einzug' | 'auszug'
  uebergabedatum: string
  uebergabeuhrzeit: string

  // Beteiligte
  vermieter: PersonData
  mieterAlt?: PersonData  // Bei Auszug
  mieterNeu?: PersonData  // Bei Einzug
  zeuge?: PersonData

  // Mietobjekt
  objektAdresse: AddressData
  wohnflaeche: number | null

  // Zählerstände
  zaehlerstaende: ZaehlerstandData[]

  // Schlüssel
  schluessel: SchluesselData[]

  // Raumweise Zustandserfassung
  raeume: RaumZustandData[]

  // Allgemeiner Zustand
  allgemeinerZustand: ZustandBewertung
  reinigungszustand: 'gereinigt' | 'besenrein' | 'nicht_gereinigt'

  // Vereinbarungen
  maengelbeseitigung?: string
  vereinbarungen?: string
  kostenuebernahme?: string

  // Unterschriften
  unterschriftVermieter: SignatureData
  unterschriftMieterAlt?: SignatureData
  unterschriftMieterNeu?: SignatureData
  unterschriftZeuge?: SignatureData

  erstelltAm: string
}

export const EMPTY_ZAEHLERSTAND: ZaehlerstandData = {
  zaehlerart: 'strom',
  zaehlernummer: '',
  stand: null,
  einheit: 'kWh',
  ablesedatum: new Date().toISOString().split('T')[0]
}

export const EMPTY_SCHLUESSEL: SchluesselData = {
  art: '',
  anzahlUebergeben: 0,
  anzahlVorhanden: 0
}

export const STANDARD_SCHLUESSEL: SchluesselData[] = [
  { art: 'Haustürschlüssel', anzahlUebergeben: 0, anzahlVorhanden: 2 },
  { art: 'Wohnungsschlüssel', anzahlUebergeben: 0, anzahlVorhanden: 3 },
  { art: 'Briefkastenschlüssel', anzahlUebergeben: 0, anzahlVorhanden: 2 },
  { art: 'Kellerschlüssel', anzahlUebergeben: 0, anzahlVorhanden: 1 },
]

export const EMPTY_RAUM: RaumZustandData = {
  raumname: '',
  raumtyp: 'wohnzimmer',
  waende: 'normal',
  decke: 'normal',
  boden: 'normal',
  fenster: 'normal',
  tueren: 'normal',
  heizkoerper: 'normal',
  steckdosen: 'normal',
  beleuchtung: 'normal'
}

export const ZUSTAND_LABELS: Record<ZustandBewertung, string> = {
  'sehr_gut': 'Sehr gut',
  'gut': 'Gut',
  'normal': 'Normal / Gebrauchsspuren',
  'maengel': 'Mängel vorhanden',
  'nicht_vorhanden': 'Nicht vorhanden'
}

export const ZUSTAND_COLORS: Record<ZustandBewertung, string> = {
  'sehr_gut': 'bg-green-100 text-green-800 border-green-200',
  'gut': 'bg-blue-100 text-blue-800 border-blue-200',
  'normal': 'bg-gray-100 text-gray-800 border-gray-200',
  'maengel': 'bg-red-100 text-red-800 border-red-200',
  'nicht_vorhanden': 'bg-gray-50 text-gray-500 border-gray-200'
}
