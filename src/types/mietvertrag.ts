// Typen für den Mietvertrag
import { AddressData, PersonData, SignatureData, DateRangeData } from '@/components/fields'

export interface MietvertragData {
  // Schritt 1: Vertragsparteien
  vermieter: PersonData
  vermieterAdresse: AddressData
  vermieterIBAN?: string
  mieter: PersonData[]
  mieterAdresse: AddressData

  // Schritt 2: Mietobjekt
  objektAdresse: AddressData
  objektLage: {
    etage: string
    lage: 'links' | 'rechts' | 'mitte' | 'vorne' | 'hinten' | ''
  }
  wohnflaeche: number | null
  zimmeranzahl: number | null
  hatBalkon: boolean
  hatTerrasse: boolean
  hatGarten: boolean
  hatKeller: boolean
  kellerNummer?: string
  hatStellplatz: boolean
  stellplatzNummer?: string
  hatGarage: boolean
  garagenNummer?: string
  hatEinbaukueche: boolean
  ausstattungSonstige: string

  // Schritt 3: Mietkonditionen
  kaltmiete: number | null
  nebenkostenVorauszahlung: number | null
  heizkostenVorauszahlung: number | null
  gesamtmiete: number | null
  zahlungsweise: 'monatlich' | 'vierteljaehrlich'
  zahlungsFaelligkeit: number // Tag des Monats
  staffelmiete: {
    enabled: boolean
    staffeln: Array<{
      abDatum: string
      betrag: number
    }>
  }
  indexmiete: {
    enabled: boolean
    basisjahr: number
    anpassungIntervall: number // Monate
  }

  // Schritt 4: Mietdauer & Kaution
  mietdauer: DateRangeData
  befristungsgrund?: string
  kaution: number | null
  kautionsart: 'barkaution' | 'sparbuch' | 'buergschaft' | 'kautionsversicherung' | ''
  ratenzahlungKaution: boolean

  // Schritt 5: Sondervereinbarungen
  tierhaltung: 'erlaubt' | 'verboten' | 'genehmigungspflichtig'
  tierhaltungDetails?: string
  untervermietung: 'erlaubt' | 'verboten' | 'genehmigungspflichtig'
  schoenheitsreparaturen: 'mieter' | 'vermieter' | 'keine'
  kleinreparaturen: {
    enabled: boolean
    einzelbetrag: number | null
    jahresbetrag: number | null
  }
  hausordnung: boolean
  gartenpflege: 'mieter' | 'vermieter'
  winterdienst: 'mieter' | 'vermieter'
  sonstigeVereinbarungen: string

  // Schritt 6: Zusammenfassung & Unterschriften
  unterschriftVermieter: SignatureData
  unterschriftMieter: SignatureData[]
  erstelltAm: string
}

export const EMPTY_PERSON: PersonData = {
  anrede: '',
  vorname: '',
  nachname: '',
  telefon: '',
  email: ''
}

export const EMPTY_ADDRESS: AddressData = {
  strasse: '',
  hausnummer: '',
  plz: '',
  ort: '',
  land: 'Deutschland'
}

export const EMPTY_SIGNATURE: SignatureData = {
  imageData: null,
  signerName: '',
  signedAt: null,
  signedLocation: ''
}

export const INITIAL_MIETVERTRAG: MietvertragData = {
  // Schritt 1
  vermieter: { ...EMPTY_PERSON },
  vermieterAdresse: { ...EMPTY_ADDRESS },
  vermieterIBAN: '',
  mieter: [{ ...EMPTY_PERSON }],
  mieterAdresse: { ...EMPTY_ADDRESS },

  // Schritt 2
  objektAdresse: { ...EMPTY_ADDRESS },
  objektLage: { etage: '', lage: '' },
  wohnflaeche: null,
  zimmeranzahl: null,
  hatBalkon: false,
  hatTerrasse: false,
  hatGarten: false,
  hatKeller: false,
  kellerNummer: '',
  hatStellplatz: false,
  stellplatzNummer: '',
  hatGarage: false,
  garagenNummer: '',
  hatEinbaukueche: false,
  ausstattungSonstige: '',

  // Schritt 3
  kaltmiete: null,
  nebenkostenVorauszahlung: null,
  heizkostenVorauszahlung: null,
  gesamtmiete: null,
  zahlungsweise: 'monatlich',
  zahlungsFaelligkeit: 3,
  staffelmiete: { enabled: false, staffeln: [] },
  indexmiete: { enabled: false, basisjahr: new Date().getFullYear(), anpassungIntervall: 12 },

  // Schritt 4
  mietdauer: { startDate: null, endDate: null, isUnbefristet: true },
  befristungsgrund: '',
  kaution: null,
  kautionsart: '',
  ratenzahlungKaution: false,

  // Schritt 5
  tierhaltung: 'genehmigungspflichtig',
  tierhaltungDetails: '',
  untervermietung: 'genehmigungspflichtig',
  schoenheitsreparaturen: 'keine',
  kleinreparaturen: { enabled: false, einzelbetrag: null, jahresbetrag: null },
  hausordnung: true,
  gartenpflege: 'vermieter',
  winterdienst: 'vermieter',
  sonstigeVereinbarungen: '',

  // Schritt 6
  unterschriftVermieter: { ...EMPTY_SIGNATURE },
  unterschriftMieter: [{ ...EMPTY_SIGNATURE }],
  erstelltAm: new Date().toISOString()
}
