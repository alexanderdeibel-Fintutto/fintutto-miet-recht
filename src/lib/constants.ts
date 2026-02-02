// Stripe Price IDs - Formulare App
export const STRIPE_PRICES = {
  basic: {
    monthly: 'price_1St4fk52lqSgjCzeAqp6QBYD',
    yearly: 'price_1St4fk52lqSgjCzeAqp6QBYD', // TODO: Add yearly price when available
    productId: 'prod_TssJeyMxgaddNx',
  },
  pro: {
    monthly: 'price_1St4gG52lqSgjCzeOiHLvvXl',
    yearly: 'price_1St4gG52lqSgjCzeOiHLvvXl', // TODO: Add yearly price when available
    productId: 'prod_TssJgIeaLhjZLD',
  },
} as const;

// Pricing Plans Configuration
export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Kostenlos',
    description: 'Für den Einstieg',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceId: null,
    yearlyPriceId: null,
    features: [
      { text: '3 Basis-Formulare', included: true },
      { text: '5 gespeicherte Dokumente', included: true },
      { text: 'Basis-Rechner', included: true },
      { text: 'Alle Premium-Formulare', included: false },
      { text: 'Unbegrenzte Dokumente', included: false },
      { text: 'PDF-Export', included: false },
    ],
    isPopular: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Für Hobby-Vermieter',
    monthlyPrice: 2499, // €24.99
    yearlyPrice: 24990, // €249.90/year = €20.83/month
    monthlyPriceId: STRIPE_PRICES.basic.monthly,
    yearlyPriceId: STRIPE_PRICES.basic.yearly,
    features: [
      { text: 'Alle Formulare', included: true },
      { text: '50 gespeicherte Dokumente', included: true },
      { text: 'Alle Rechner', included: true },
      { text: 'PDF-Export', included: true },
      { text: 'E-Mail-Support', included: true },
      { text: 'Immobilienverwaltung', included: false },
    ],
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Für professionelle Vermieter',
    monthlyPrice: 7900, // €79.00
    yearlyPrice: 79000, // €790.00/year = €65.83/month
    monthlyPriceId: STRIPE_PRICES.pro.monthly,
    yearlyPriceId: STRIPE_PRICES.pro.yearly,
    features: [
      { text: 'Alles aus Basic', included: true },
      { text: 'Unbegrenzte Dokumente', included: true },
      { text: 'Immobilienverwaltung', included: true },
      { text: 'Zählerstand-Erfassung', included: true },
      { text: 'Nebenkostenabrechnung', included: true },
      { text: 'Prioritäts-Support', included: true },
    ],
    isPopular: true,
  },
] as const;

export const FREE_TIER_LIMITS = {
  maxDocuments: 5,
  allowedForms: [
    'standard_mietvertrag',
    'kuendigung_mieter',
    'uebergabeprotokoll',
  ],
} as const;

export const FORM_CATEGORIES = [
  {
    id: 'mietvertraege',
    title: 'Mietverträge',
    icon: 'FileText',
    forms: [
      { id: 'standard_mietvertrag', title: 'Standard-Mietvertrag', isPremium: false },
      { id: 'moebliert_mietvertrag', title: 'Mietvertrag möblierte Wohnung', isPremium: true },
      { id: 'wg_mietvertrag', title: 'WG-Mietvertrag', isPremium: true },
      { id: 'gewerbe_mietvertrag', title: 'Gewerbemietvertrag', isPremium: true },
    ],
  },
  {
    id: 'kuendigungen',
    title: 'Kündigungen',
    icon: 'Mail',
    forms: [
      { id: 'kuendigung_mieter', title: 'Kündigung durch Mieter (ordentlich)', isPremium: false },
      { id: 'kuendigung_vermieter', title: 'Kündigung durch Vermieter (ordentlich)', isPremium: true },
      { id: 'sonderkuendigung', title: 'Sonderkündigung (außerordentlich)', isPremium: true },
    ],
  },
  {
    id: 'abrechnungen',
    title: 'Abrechnungen',
    icon: 'Calculator',
    forms: [
      { id: 'nebenkostenabrechnung', title: 'Nebenkostenabrechnung', isPremium: true },
      { id: 'heizkostenabrechnung', title: 'Heizkostenabrechnung', isPremium: true },
    ],
  },
  {
    id: 'protokolle',
    title: 'Protokolle',
    icon: 'ClipboardList',
    forms: [
      { id: 'uebergabeprotokoll', title: 'Übergabeprotokoll (Ein-/Auszug)', isPremium: false },
      { id: 'maengelprotokoll', title: 'Mängelprotokoll', isPremium: true },
    ],
  },
  {
    id: 'sonstiges',
    title: 'Sonstiges',
    icon: 'MoreHorizontal',
    forms: [
      { id: 'mieterhoehung', title: 'Mieterhöhungsverlangen', isPremium: true },
      { id: 'mietminderung', title: 'Mietminderungsschreiben', isPremium: true },
      { id: 'kaution', title: 'Kautionsvereinbarung', isPremium: true },
      { id: 'mahnung', title: 'Mahnschreiben', isPremium: true },
    ],
  },
] as const;

export const BUNDESLAENDER = [
  { value: 'baden-wuerttemberg', label: 'Baden-Württemberg', grunderwerbsteuer: 5.0 },
  { value: 'bayern', label: 'Bayern', grunderwerbsteuer: 3.5 },
  { value: 'berlin', label: 'Berlin', grunderwerbsteuer: 6.0 },
  { value: 'brandenburg', label: 'Brandenburg', grunderwerbsteuer: 6.5 },
  { value: 'bremen', label: 'Bremen', grunderwerbsteuer: 5.0 },
  { value: 'hamburg', label: 'Hamburg', grunderwerbsteuer: 5.5 },
  { value: 'hessen', label: 'Hessen', grunderwerbsteuer: 6.0 },
  { value: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern', grunderwerbsteuer: 6.0 },
  { value: 'niedersachsen', label: 'Niedersachsen', grunderwerbsteuer: 5.0 },
  { value: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen', grunderwerbsteuer: 6.5 },
  { value: 'rheinland-pfalz', label: 'Rheinland-Pfalz', grunderwerbsteuer: 5.0 },
  { value: 'saarland', label: 'Saarland', grunderwerbsteuer: 6.5 },
  { value: 'sachsen', label: 'Sachsen', grunderwerbsteuer: 5.5 },
  { value: 'sachsen-anhalt', label: 'Sachsen-Anhalt', grunderwerbsteuer: 5.0 },
  { value: 'schleswig-holstein', label: 'Schleswig-Holstein', grunderwerbsteuer: 6.5 },
  { value: 'thueringen', label: 'Thüringen', grunderwerbsteuer: 5.0 },
] as const;
