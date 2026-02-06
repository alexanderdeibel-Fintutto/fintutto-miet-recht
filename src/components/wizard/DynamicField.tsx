import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CurrencyField } from '@/components/fields/CurrencyField'
import { AddressAutocomplete } from '@/components/maps/AddressAutocomplete'
import { IBANField } from '@/components/fields/IBANField'
import type { FormFieldDefinition } from '@/hooks/useFormTemplate'

interface DynamicFieldProps {
  field: FormFieldDefinition
  value: any
  onChange: (name: string, value: any) => void
  error?: string
}

export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  const { name, label, type, required, options, placeholder } = field
  
  const handleChange = (newValue: any) => {
    onChange(name, newValue)
  }

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <Input
            id={name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={error ? 'border-destructive' : ''}
          />
        )

      case 'textarea':
        return (
          <Textarea
            id={name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={error ? 'border-destructive' : ''}
          />
        )

      case 'date':
        return (
          <Input
            id={name}
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className={error ? 'border-destructive' : ''}
          />
        )

      case 'number':
        return (
          <Input
            id={name}
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={error ? 'border-destructive' : ''}
          />
        )

      case 'currency':
        return (
          <CurrencyField
            value={value || 0}
            onChange={handleChange}
          />
        )

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleChange}>
            <SelectTrigger className={error ? 'border-destructive' : ''}>
              <SelectValue placeholder={`${label} auswählen...`} />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={name}
              checked={value || false}
              onCheckedChange={handleChange}
            />
            <Label htmlFor={name} className="text-sm font-normal cursor-pointer">
              {label}
            </Label>
          </div>
        )

      case 'address':
        return (
          <AddressAutocomplete
            value={value || ''}
            onChange={handleChange}
            placeholder={placeholder || 'Adresse eingeben...'}
          />
        )

      case 'iban':
        return (
          <IBANField
            value={value || ''}
            onChange={handleChange}
          />
        )

      default:
        return (
          <Input
            id={name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
          />
        )
    }
  }

  // Checkbox has its own label handling
  if (type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
