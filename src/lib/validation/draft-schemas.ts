// Zod validation schemas for localStorage draft data
import { z } from 'zod'

// Base field schemas
const AddressDataSchema = z.object({
  strasse: z.string(),
  hausnummer: z.string(),
  plz: z.string(),
  ort: z.string(),
  land: z.string().optional()
}).partial()

const PersonDataSchema = z.object({
  anrede: z.string(),
  vorname: z.string(),
  nachname: z.string(),
  telefon: z.string().optional(),
  email: z.string().optional()
}).partial()

const SignatureDataSchema = z.object({
  imageData: z.string().nullable(),
  signerName: z.string(),
  signedAt: z.string().nullable(),
  signedLocation: z.string()
}).partial()

const DateRangeDataSchema = z.object({
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  isUnbefristet: z.boolean().optional()
}).partial()

// Mietvertrag-specific schemas
const StaffelSchema = z.object({
  abDatum: z.string(),
  betrag: z.number()
}).partial()

const StaffelmieteDraftSchema = z.object({
  enabled: z.boolean(),
  staffeln: z.array(StaffelSchema).optional()
}).partial()

const IndexmieteDraftSchema = z.object({
  enabled: z.boolean(),
  basisjahr: z.number().optional(),
  anpassungIntervall: z.number().optional()
}).partial()

const KleinreparaturenDraftSchema = z.object({
  enabled: z.boolean(),
  einzelbetrag: z.number().nullable().optional(),
  jahresbetrag: z.number().nullable().optional()
}).partial()

const ObjektLageDraftSchema = z.object({
  etage: z.string(),
  lage: z.enum(['links', 'rechts', 'mitte', 'vorne', 'hinten', '']).optional()
}).partial()

// Main Mietvertrag draft schema (all fields optional for partial drafts)
export const MietvertragDraftSchema = z.object({
  // Schritt 1: Vertragsparteien
  vermieter: PersonDataSchema.optional(),
  vermieterAdresse: AddressDataSchema.optional(),
  vermieterIBAN: z.string().optional(),
  mieter: z.array(PersonDataSchema).optional(),
  mieterAdresse: AddressDataSchema.optional(),

  // Schritt 2: Mietobjekt
  objektAdresse: AddressDataSchema.optional(),
  objektLage: ObjektLageDraftSchema.optional(),
  wohnflaeche: z.number().nullable().optional(),
  zimmeranzahl: z.number().nullable().optional(),
  hatBalkon: z.boolean().optional(),
  hatTerrasse: z.boolean().optional(),
  hatGarten: z.boolean().optional(),
  hatKeller: z.boolean().optional(),
  kellerNummer: z.string().optional(),
  hatStellplatz: z.boolean().optional(),
  stellplatzNummer: z.string().optional(),
  hatGarage: z.boolean().optional(),
  garagenNummer: z.string().optional(),
  hatEinbaukueche: z.boolean().optional(),
  ausstattungSonstige: z.string().optional(),

  // Schritt 3: Mietkonditionen
  kaltmiete: z.number().nullable().optional(),
  nebenkostenVorauszahlung: z.number().nullable().optional(),
  heizkostenVorauszahlung: z.number().nullable().optional(),
  gesamtmiete: z.number().nullable().optional(),
  zahlungsweise: z.enum(['monatlich', 'vierteljaehrlich']).optional(),
  zahlungsFaelligkeit: z.number().optional(),
  staffelmiete: StaffelmieteDraftSchema.optional(),
  indexmiete: IndexmieteDraftSchema.optional(),

  // Schritt 4: Mietdauer & Kaution
  mietdauer: DateRangeDataSchema.optional(),
  befristungsgrund: z.string().optional(),
  kaution: z.number().nullable().optional(),
  kautionsart: z.enum(['barkaution', 'sparbuch', 'buergschaft', 'kautionsversicherung', '']).optional(),
  ratenzahlungKaution: z.boolean().optional(),

  // Schritt 5: Sondervereinbarungen
  tierhaltung: z.enum(['erlaubt', 'verboten', 'genehmigungspflichtig']).optional(),
  tierhaltungDetails: z.string().optional(),
  untervermietung: z.enum(['erlaubt', 'verboten', 'genehmigungspflichtig']).optional(),
  schoenheitsreparaturen: z.enum(['mieter', 'vermieter', 'keine']).optional(),
  kleinreparaturen: KleinreparaturenDraftSchema.optional(),
  hausordnung: z.boolean().optional(),
  gartenpflege: z.enum(['mieter', 'vermieter']).optional(),
  winterdienst: z.enum(['mieter', 'vermieter']).optional(),
  sonstigeVereinbarungen: z.string().optional(),

  // Schritt 6: Zusammenfassung & Unterschriften
  unterschriftVermieter: SignatureDataSchema.optional(),
  unterschriftMieter: z.array(SignatureDataSchema).optional(),
  erstelltAm: z.string().optional()
}).partial()

// Uebergabeprotokoll-specific schemas
const ZustandBewertungSchema = z.enum(['sehr_gut', 'gut', 'normal', 'maengel', 'nicht_vorhanden'])

const ZaehlerstandDataSchema = z.object({
  zaehlerart: z.enum(['strom', 'gas', 'wasser', 'heizung', 'warmwasser']),
  zaehlernummer: z.string(),
  stand: z.number().nullable(),
  einheit: z.string(),
  ablesedatum: z.string(),
  foto: z.string().optional()
}).partial()

const SchluesselDataSchema = z.object({
  art: z.string(),
  anzahlUebergeben: z.number(),
  anzahlVorhanden: z.number(),
  bemerkung: z.string().optional()
}).partial()

const RaumZustandDataSchema = z.object({
  raumname: z.string(),
  raumtyp: z.enum(['wohnzimmer', 'schlafzimmer', 'kinderzimmer', 'kueche', 'bad', 'wc', 'flur', 'abstellraum', 'keller', 'balkon', 'terrasse', 'sonstige']),
  waende: ZustandBewertungSchema,
  waendeBemerkung: z.string().optional(),
  decke: ZustandBewertungSchema,
  deckeBemerkung: z.string().optional(),
  boden: ZustandBewertungSchema,
  bodenBemerkung: z.string().optional(),
  bodenart: z.string().optional(),
  fenster: ZustandBewertungSchema,
  fensterBemerkung: z.string().optional(),
  fensterAnzahl: z.number().optional(),
  tueren: ZustandBewertungSchema,
  tuerenBemerkung: z.string().optional(),
  heizkoerper: ZustandBewertungSchema,
  heizkoerperBemerkung: z.string().optional(),
  heizkoerperAnzahl: z.number().optional(),
  steckdosen: ZustandBewertungSchema,
  steckdosenBemerkung: z.string().optional(),
  steckdosenAnzahl: z.number().optional(),
  beleuchtung: ZustandBewertungSchema,
  beleuchtungBemerkung: z.string().optional(),
  sonstigesMaengel: z.string().optional(),
  fotos: z.array(z.string()).optional()
}).partial()

// Main Uebergabeprotokoll draft schema
export const UebergabeprotokollDraftSchema = z.object({
  protokollart: z.enum(['einzug', 'auszug']).optional(),
  uebergabedatum: z.string().optional(),
  uebergabeuhrzeit: z.string().optional(),
  
  vermieter: PersonDataSchema.optional(),
  mieterAlt: PersonDataSchema.optional(),
  mieterNeu: PersonDataSchema.optional(),
  zeuge: PersonDataSchema.optional(),
  
  objektAdresse: AddressDataSchema.optional(),
  wohnflaeche: z.number().nullable().optional(),
  
  zaehlerstaende: z.array(ZaehlerstandDataSchema).optional(),
  schluessel: z.array(SchluesselDataSchema).optional(),
  raeume: z.array(RaumZustandDataSchema).optional(),
  
  allgemeinerZustand: ZustandBewertungSchema.optional(),
  reinigungszustand: z.enum(['gereinigt', 'besenrein', 'nicht_gereinigt']).optional(),
  
  maengelbeseitigung: z.string().optional(),
  vereinbarungen: z.string().optional(),
  kostenuebernahme: z.string().optional(),
  
  unterschriftVermieter: SignatureDataSchema.optional(),
  unterschriftMieterAlt: SignatureDataSchema.optional(),
  unterschriftMieterNeu: SignatureDataSchema.optional(),
  unterschriftZeuge: SignatureDataSchema.optional(),
  
  erstelltAm: z.string().optional()
}).partial()

// Utility function to safely parse and validate localStorage draft
export function parseAndValidateDraft<T>(
  storageKey: string,
  schema: z.ZodSchema<T>,
  defaultValue: T
): { data: T; wasInvalid: boolean } {
  const draft = localStorage.getItem(storageKey)
  
  if (!draft) {
    return { data: defaultValue, wasInvalid: false }
  }

  try {
    const parsed = JSON.parse(draft)
    const result = schema.safeParse(parsed)
    
    if (result.success) {
      // Merge with default to ensure all required fields exist
      return { 
        data: { ...defaultValue, ...result.data }, 
        wasInvalid: false 
      }
    } else {
      console.warn(`Invalid draft schema for ${storageKey}:`, result.error.issues)
      // Remove corrupted draft
      localStorage.removeItem(storageKey)
      return { data: defaultValue, wasInvalid: true }
    }
  } catch (error) {
    console.warn(`Failed to parse draft for ${storageKey}:`, error)
    // Remove corrupted draft
    localStorage.removeItem(storageKey)
    return { data: defaultValue, wasInvalid: true }
  }
}

export type MietvertragDraft = z.infer<typeof MietvertragDraftSchema>
export type UebergabeprotokollDraft = z.infer<typeof UebergabeprotokollDraftSchema>
