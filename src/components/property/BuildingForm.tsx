import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/integrations/supabase/client'
import { AddressAutocomplete, MapPreview } from '@/components/maps'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Building2, Loader2, Save } from 'lucide-react'
import type { ParsedAddress } from '@/hooks/useGoogleMaps'

const buildingSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  totalUnits: z.number().min(1, 'Mindestens 1 Einheit').optional(),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
  totalArea: z.number().positive().optional(),
})

type BuildingFormData = z.infer<typeof buildingSchema>

interface BuildingFormProps {
  organizationId: string
  onSuccess?: (buildingId: string) => void
  onCancel?: () => void
}

export function BuildingForm({ organizationId, onSuccess, onCancel }: BuildingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<ParsedAddress | null>(null)
  const [isAddressValid, setIsAddressValid] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
  })

  const validateAddressOnServer = async (): Promise<boolean> => {
    if (!selectedAddress) return false

    try {
      const { data, error } = await supabase.functions.invoke('validate-address', {
        body: { 
          address: selectedAddress.formattedAddress,
          placeId: selectedAddress.placeId 
        },
      })

      if (error) throw error
      return data?.isValid === true
    } catch (err) {
      console.error('Server validation error:', err)
      toast.error('Adressvalidierung fehlgeschlagen')
      return false
    }
  }

  const onSubmit = async (formData: BuildingFormData) => {
    if (!selectedAddress || !isAddressValid) {
      toast.error('Bitte wählen Sie eine gültige Adresse aus den Vorschlägen')
      return
    }

    setIsSubmitting(true)

    // Final server-side validation
    const isValidOnServer = await validateAddressOnServer()
    if (!isValidOnServer) {
      toast.error('Die Adresse konnte nicht verifiziert werden. Bitte wählen Sie eine gültige Adresse.')
      setIsSubmitting(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('buildings')
        .insert({
          organization_id: organizationId,
          name: formData.name,
          address: `${selectedAddress.street} ${selectedAddress.houseNumber}`.trim(),
          postal_code: selectedAddress.postalCode,
          city: selectedAddress.city,
          country: selectedAddress.country,
          total_units: formData.totalUnits,
          year_built: formData.yearBuilt,
          total_area: formData.totalArea,
        })
        .select('id')
        .single()

      if (error) throw error

      toast.success('Gebäude erfolgreich angelegt')
      onSuccess?.(data.id)
    } catch (err) {
      console.error('Error creating building:', err)
      toast.error('Fehler beim Anlegen des Gebäudes')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Neues Gebäude anlegen
          </CardTitle>
          <CardDescription>
            Nur verifizierte Adressen können gespeichert werden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Building Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Gebäudebezeichnung <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="z.B. Mehrfamilienhaus Hauptstraße"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Address with Google Maps Autocomplete */}
          <AddressAutocomplete
            label="Adresse"
            required
            onChange={setSelectedAddress}
            onValidationChange={setIsAddressValid}
            placeholder="Straße und Hausnummer eingeben..."
          />

          {/* Map Preview */}
          <MapPreview
            lat={selectedAddress?.lat}
            lng={selectedAddress?.lng}
            address={selectedAddress?.formattedAddress}
            height="250px"
          />

          {/* Parsed Address Details (readonly) */}
          {selectedAddress && isAddressValid && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Straße</Label>
                <p className="text-sm font-medium">
                  {selectedAddress.street} {selectedAddress.houseNumber}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">PLZ / Stadt</Label>
                <p className="text-sm font-medium">
                  {selectedAddress.postalCode} {selectedAddress.city}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Land</Label>
                <p className="text-sm font-medium">{selectedAddress.country}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Koordinaten</Label>
                <p className="text-sm font-medium">
                  {selectedAddress.lat.toFixed(6)}, {selectedAddress.lng.toFixed(6)}
                </p>
              </div>
            </div>
          )}

          {/* Optional Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalUnits">Anzahl Einheiten</Label>
              <Input
                id="totalUnits"
                type="number"
                min={1}
                placeholder="z.B. 12"
                {...register('totalUnits', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Baujahr</Label>
              <Input
                id="yearBuilt"
                type="number"
                min={1800}
                max={new Date().getFullYear()}
                placeholder="z.B. 1985"
                {...register('yearBuilt', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalArea">Gesamtfläche (m²)</Label>
              <Input
                id="totalArea"
                type="number"
                min={1}
                placeholder="z.B. 850"
                {...register('totalArea', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !isAddressValid}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Gebäude speichern
        </Button>
      </div>
    </form>
  )
}
