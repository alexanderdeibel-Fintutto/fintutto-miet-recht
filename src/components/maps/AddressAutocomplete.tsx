import { useState, useEffect, useRef } from 'react'
import { useGoogleMaps, type PlacePrediction, type ParsedAddress } from '@/hooks/useGoogleMaps'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Loader2, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddressAutocompleteProps {
  value?: string
  onChange?: (address: ParsedAddress | null) => void
  onValidationChange?: (isValid: boolean) => void
  label?: string
  placeholder?: string
  required?: boolean
  className?: string
}

export function AddressAutocomplete({
  value = '',
  onChange,
  onValidationChange,
  label = 'Adresse',
  placeholder = 'Straße und Hausnummer eingeben...',
  required = false,
  className,
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValidated, setIsValidated] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<ParsedAddress | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  const { error, getPlacePredictions, getPlaceDetails } = useGoogleMaps()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch predictions with debounce
  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setPredictions([])
      return
    }

    // Don't search if we already selected this address
    if (selectedAddress?.formattedAddress === inputValue) {
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      const results = await getPlacePredictions(inputValue)
      setPredictions(results)
      setIsOpen(results.length > 0)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue, getPlacePredictions, selectedAddress])

  const handleSelect = async (prediction: PlacePrediction) => {
    setIsValidating(true)
    setIsOpen(false)
    setInputValue(prediction.description)

    const details = await getPlaceDetails(prediction.place_id)
    
    if (details) {
      setSelectedAddress(details)
      setIsValidated(true)
      onChange?.(details)
      onValidationChange?.(true)
    } else {
      setIsValidated(false)
      onValidationChange?.(false)
    }
    
    setIsValidating(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Reset validation when user types
    if (selectedAddress?.formattedAddress !== newValue) {
      setIsValidated(false)
      setSelectedAddress(null)
      onChange?.(null)
      onValidationChange?.(false)
    }
  }

  if (error) {
    return (
      <div className={cn('space-y-2', className)}>
        {label && <Label className="text-destructive">{label}</Label>}
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className={cn('relative space-y-2', className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'pl-10 pr-10',
            isValidated && 'border-primary focus-visible:ring-primary'
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {isValidated && !isValidating && <Check className="h-4 w-4 text-primary" />}
        </div>
      </div>

      {/* Predictions dropdown */}
      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-start gap-3"
            >
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <div className="font-medium text-sm">
                  {prediction.structured_formatting.main_text}
                </div>
                <div className="text-xs text-muted-foreground">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Validation hint */}
      {inputValue && !isValidated && !isValidating && !isOpen && (
        <p className="text-xs text-muted-foreground">
          Bitte wählen Sie eine Adresse aus den Vorschlägen aus
        </p>
      )}
    </div>
  )
}
