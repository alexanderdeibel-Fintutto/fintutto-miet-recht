import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatierung für deutsche Währung
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// Formatierung für deutsches Datum
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

// IBAN validieren
export function validateIBAN(iban: string): boolean {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase()
  if (!/^DE\d{20}$/.test(cleanIban)) return false

  // Einfache Prüfsummenvalidierung
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4)
  const numericIban = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString()
  )

  let remainder = ''
  for (const digit of numericIban) {
    remainder = (BigInt(remainder + digit) % 97n).toString()
  }

  return remainder === '1'
}

// IBAN formatieren
export function formatIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, '').toUpperCase()
  return clean.replace(/(.{4})/g, '$1 ').trim()
}

// PLZ validieren (Deutschland)
export function validatePLZ(plz: string): boolean {
  return /^\d{5}$/.test(plz)
}

// Kündigungsfrist berechnen (nach § 573c BGB)
export function calculateKuendigungsfrist(wohndauerJahre: number, istVermieter: boolean): number {
  if (!istVermieter) {
    // Mieter: immer 3 Monate
    return 3
  }
  // Vermieter: gestaffelt
  if (wohndauerJahre < 5) return 3
  if (wohndauerJahre < 8) return 6
  return 9
}

// Maximale Kaution berechnen (§ 551 BGB)
export function calculateMaxKaution(kaltmiete: number): number {
  return kaltmiete * 3
}

// Mieterhöhungs-Kappungsgrenze prüfen
export function checkKappungsgrenze(
  altereMiete: number,
  neueMiete: number,
  istAngespannterWohnungsmarkt: boolean
): { erlaubt: boolean; maxErhohung: number; prozent: number } {
  const maxProzent = istAngespannterWohnungsmarkt ? 15 : 20
  const maxErhohung = altereMiete * (maxProzent / 100)
  const tatsaechlicheErhohung = neueMiete - altereMiete
  const prozent = (tatsaechlicheErhohung / altereMiete) * 100

  return {
    erlaubt: tatsaechlicheErhohung <= maxErhohung,
    maxErhohung,
    prozent,
  }
}

// Betriebskosten-Vorauszahlung auf Monat umrechnen
export function calculateMonthlyPrepayment(yearlyAmount: number): number {
  return Math.round((yearlyAmount / 12) * 100) / 100
}
