// Form Shop Constants - Categories, Tiers, and Form Slugs

export const FORM_CATEGORIES = {
  vertraege: { label: 'Verträge', icon: 'FileText' },
  schreiben: { label: 'Schreiben', icon: 'Mail' },
  protokolle: { label: 'Protokolle', icon: 'ClipboardList' },
  kuendigung: { label: 'Kündigung', icon: 'FileX' },
  abrechnung: { label: 'Abrechnung', icon: 'Calculator' },
  sonstige: { label: 'Sonstige', icon: 'File' },
} as const;

export const FORM_TIERS = {
  free: { label: 'Kostenlos', color: 'bg-success text-success-foreground' },
  basic: { label: 'Basic', color: 'bg-primary text-primary-foreground' },
  premium: { label: 'Premium', color: 'bg-secondary text-secondary-foreground' },
} as const;

export const FORM_PERSONAS = {
  vermieter: { label: 'Für Vermieter', icon: 'Building2' },
  mieter: { label: 'Für Mieter', icon: 'Home' },
  beide: { label: 'Für Alle', icon: 'Users' },
} as const;

// Complete form slug list with metadata
export const FORM_SLUGS = {
  // FREE Tier
  'wohnungsgeberbestaetigung': { name: 'Wohnungsgeberbestätigung', tier: 'free', persona: 'vermieter', category: 'sonstige', price: 0 },
  'mietbescheinigung': { name: 'Mietbescheinigung', tier: 'free', persona: 'vermieter', category: 'sonstige', price: 0 },
  'mietschuldenfreiheit': { name: 'Mietschuldenfreiheitsbescheinigung', tier: 'free', persona: 'vermieter', category: 'schreiben', price: 0 },
  'sepa-lastschrift': { name: 'SEPA-Lastschriftmandat', tier: 'free', persona: 'beide', category: 'sonstige', price: 0 },
  'schluessel-quittung': { name: 'Schlüsselquittung', tier: 'free', persona: 'vermieter', category: 'protokolle', price: 0 },

  // BASIC Tier
  'hausordnung': { name: 'Hausordnung', tier: 'basic', persona: 'vermieter', category: 'sonstige', price: 499 },
  'mahnung': { name: 'Mahnung', tier: 'basic', persona: 'vermieter', category: 'schreiben', price: 499 },
  'mieterhoehung-standard': { name: 'Mieterhöhung', tier: 'basic', persona: 'vermieter', category: 'schreiben', price: 699 },
  'untermieterlaubnis': { name: 'Untermieterlaubnis', tier: 'basic', persona: 'vermieter', category: 'schreiben', price: 499 },
  'nachtragsvereinbarung': { name: 'Nachtragsvereinbarung', tier: 'basic', persona: 'beide', category: 'vertraege', price: 699 },
  'ratenzahlung': { name: 'Ratenzahlungsvereinbarung', tier: 'basic', persona: 'vermieter', category: 'vertraege', price: 499 },
  'vollmacht': { name: 'Vollmacht', tier: 'basic', persona: 'beide', category: 'sonstige', price: 299 },
  'betretungsrecht': { name: 'Betretungsrecht-Ankündigung', tier: 'basic', persona: 'vermieter', category: 'schreiben', price: 299 },
  'eigentuemerwechsel': { name: 'Eigentümerwechsel-Mitteilung', tier: 'basic', persona: 'vermieter', category: 'schreiben', price: 299 },
  'besichtigungstermin': { name: 'Besichtigungstermin', tier: 'basic', persona: 'vermieter', category: 'schreiben', price: 299 },
  'maengelanzeige': { name: 'Mängelanzeige', tier: 'basic', persona: 'mieter', category: 'schreiben', price: 499 },
  'kuendigung-mieter': { name: 'Kündigung (Mieter)', tier: 'basic', persona: 'mieter', category: 'kuendigung', price: 499 },
  'widerspruch-mieterhoehung': { name: 'Widerspruch Mieterhöhung', tier: 'basic', persona: 'mieter', category: 'schreiben', price: 699 },

  // PREMIUM Tier
  'mietvertrag': { name: 'Mietvertrag (Standard)', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 1499 },
  'mietvertrag-gewerbe': { name: 'Gewerbemietvertrag', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 1999 },
  'mietvertrag-moebliert': { name: 'Mietvertrag möbliert', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 1499 },
  'mietvertrag-wg': { name: 'WG-Mietvertrag', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 1499 },
  'staffelmietvertrag': { name: 'Staffelmietvertrag', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 1499 },
  'indexmietvertrag': { name: 'Indexmietvertrag', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 1499 },
  'stellplatz-garage': { name: 'Stellplatz-/Garagenmietvertrag', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 999 },
  'mietaufhebung': { name: 'Mietaufhebungsvertrag', tier: 'premium', persona: 'beide', category: 'vertraege', price: 1299 },
  'kuendigung-ordentlich': { name: 'Ordentliche Kündigung', tier: 'premium', persona: 'vermieter', category: 'kuendigung', price: 999 },
  'kuendigung-eigenbedarf': { name: 'Eigenbedarfskündigung', tier: 'premium', persona: 'vermieter', category: 'kuendigung', price: 1499 },
  'kuendigung-fristlos': { name: 'Fristlose Kündigung', tier: 'premium', persona: 'vermieter', category: 'kuendigung', price: 1499 },
  'abmahnung': { name: 'Abmahnung', tier: 'premium', persona: 'vermieter', category: 'schreiben', price: 999 },
  'nebenkostenabrechnung': { name: 'Nebenkostenabrechnung', tier: 'premium', persona: 'vermieter', category: 'abrechnung', price: 1999 },
  'kautionsabrechnung': { name: 'Kautionsabrechnung', tier: 'premium', persona: 'vermieter', category: 'abrechnung', price: 999 },
  'anlage-v': { name: 'Anlage V (Steuererklärung)', tier: 'premium', persona: 'vermieter', category: 'abrechnung', price: 1499 },
  'uebergabe-einzug': { name: 'Übergabeprotokoll (Einzug)', tier: 'premium', persona: 'vermieter', category: 'protokolle', price: 999 },
  'uebergabe-auszug': { name: 'Übergabeprotokoll (Auszug)', tier: 'premium', persona: 'vermieter', category: 'protokolle', price: 999 },
  'wohnungsbesichtigung': { name: 'Besichtigungsprotokoll', tier: 'premium', persona: 'vermieter', category: 'protokolle', price: 499 },
  'mieterselbstauskunft': { name: 'Mieterselbstauskunft', tier: 'premium', persona: 'vermieter', category: 'sonstige', price: 699 },
  'schufa-anforderung': { name: 'SCHUFA-Anforderung', tier: 'premium', persona: 'vermieter', category: 'schreiben', price: 299 },
  'bank-expose': { name: 'Bank-Exposé', tier: 'premium', persona: 'vermieter', category: 'sonstige', price: 999 },
  'mietbuergschaft': { name: 'Mietbürgschaftserklärung', tier: 'premium', persona: 'vermieter', category: 'vertraege', price: 699 },
  'modernisierung': { name: 'Modernisierungsankündigung', tier: 'premium', persona: 'vermieter', category: 'schreiben', price: 1299 },
  'index-anpassung': { name: 'Indexanpassung', tier: 'premium', persona: 'vermieter', category: 'schreiben', price: 699 },
  'mietminderung': { name: 'Mietminderung', tier: 'premium', persona: 'mieter', category: 'schreiben', price: 999 },
  'widerspruch-nk': { name: 'Widerspruch Nebenkostenabrechnung', tier: 'premium', persona: 'mieter', category: 'schreiben', price: 999 },
  'sonderkuendigung': { name: 'Sonderkündigung', tier: 'premium', persona: 'mieter', category: 'kuendigung', price: 999 },
} as const;

export type FormSlug = keyof typeof FORM_SLUGS;
export type FormTier = 'free' | 'basic' | 'premium';
export type FormCategory = keyof typeof FORM_CATEGORIES;
export type FormPersona = 'vermieter' | 'mieter' | 'beide';

// Utility function to format price in EUR
export const formatPrice = (cents: number): string => {
  if (cents === 0) return 'Kostenlos';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
};

// Get tier badge styling
export const getTierBadgeClass = (tier: FormTier): string => {
  return FORM_TIERS[tier]?.color || FORM_TIERS.free.color;
};
