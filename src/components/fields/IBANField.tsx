'use client'

import * as React from 'react'
import { CreditCard, Check, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, validateIBAN, formatIBAN } from '@/lib/utils'

interface IBANFieldProps {
  value: string
  onChange: (value: string) => void
  onBICChange?: (bic: string) => void
  label?: string
  required?: boolean
  error?: string
  disabled?: boolean
  showBIC?: boolean
}

// Einfache BIC-Lookup-Tabelle für deutsche Banken (Auszug)
const BANK_DATA: Record<string, { bic: string; name: string }> = {
  '10010010': { bic: 'PBNKDEFF', name: 'Postbank' },
  '10020500': { bic: 'BFSWDE33BER', name: 'Bank für Sozialwirtschaft' },
  '10070000': { bic: 'DEUTDEDB101', name: 'Deutsche Bank' },
  '10070024': { bic: 'DEUTDEDBBER', name: 'Deutsche Bank' },
  '10090000': { bic: 'BEVODEBB', name: 'Berliner Volksbank' },
  '20050550': { bic: 'HASPDEHHXXX', name: 'Hamburger Sparkasse' },
  '37040044': { bic: 'COBADEFFXXX', name: 'Commerzbank' },
  '50010517': { bic: 'INGDDEFFXXX', name: 'ING-DiBa' },
  '70010080': { bic: 'PBNKDEFFXXX', name: 'Postbank' },
  '76010085': { bic: 'PBNKDEFFXXX', name: 'Postbank' },
}

export function IBANField({
  value,
  onChange,
  onBICChange,
  label = "IBAN",
  required = false,
  error,
  disabled = false,
  showBIC = true
}: IBANFieldProps) {
  const [isValid, setIsValid] = React.useState<boolean | null>(null)
  const [bankInfo, setBankInfo] = React.useState<{ bic: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '').toUpperCase()
    const formatted = formatIBAN(rawValue)
    onChange(formatted)

    // Validierung
    if (rawValue.length >= 22) {
      setIsLoading(true)
      // Simuliere kurze Verzögerung für UX
      setTimeout(() => {
        const valid = validateIBAN(rawValue)
        setIsValid(valid)

        // BIC-Lookup
        if (valid && rawValue.startsWith('DE')) {
          const blz = rawValue.substring(4, 12)
          const bank = BANK_DATA[blz]
          if (bank) {
            setBankInfo(bank)
            onBICChange?.(bank.bic)
          } else {
            setBankInfo(null)
          }
        }
        setIsLoading(false)
      }, 300)
    } else {
      setIsValid(null)
      setBankInfo(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="iban" className="text-base font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>

      <div className="relative">
        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="iban"
          value={value}
          onChange={handleChange}
          placeholder="DE89 3704 0044 0532 0130 00"
          disabled={disabled}
          className={cn(
            "pl-10 pr-10 font-mono tracking-wider",
            isValid === true && "border-green-500 focus-visible:ring-green-500",
            isValid === false && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={27} // DE + 20 Ziffern + 5 Leerzeichen
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!isLoading && isValid === true && <Check className="h-4 w-4 text-green-500" />}
          {!isLoading && isValid === false && <X className="h-4 w-4 text-destructive" />}
        </div>
      </div>

      {/* Bank-Info */}
      {showBIC && bankInfo && (
        <div className="p-3 bg-muted rounded-md text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Bank:</span>
            <span className="font-medium">{bankInfo.name}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-muted-foreground">BIC:</span>
            <span className="font-mono">{bankInfo.bic}</span>
          </div>
        </div>
      )}

      {/* Validierungsfehler */}
      {isValid === false && (
        <p className="text-sm text-destructive">
          Die eingegebene IBAN ist ungültig. Bitte überprüfen Sie Ihre Eingabe.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Deutsche IBAN: DE + 2 Prüfziffern + 8-stellige Bankleitzahl + 10-stellige Kontonummer
      </p>
    </div>
  )
}
