import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface FormFieldDefinition {
  name: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox' | 'number' | 'currency' | 'address' | 'iban'
  required?: boolean
  options?: string[]
  placeholder?: string
}

export interface FormStepDefinition {
  step: number
  title: string
  fields: FormFieldDefinition[]
}

export interface FormTemplateWithFields {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  tier: string
  persona: string
  fields: FormStepDefinition[]
  is_active: boolean
}

export function useFormTemplate(slug: string | undefined) {
  return useQuery({
    queryKey: ['form-template', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required')
      
      const { data, error } = await supabase
        .from('form_templates')
        .select('id, slug, name, description, category, tier, persona, fields, is_active')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      
      // Parse fields if they're stored as JSON
      const template = data as any
      let parsedFields: FormStepDefinition[] = []
      
      if (template.fields) {
        if (typeof template.fields === 'string') {
          parsedFields = JSON.parse(template.fields)
        } else if (Array.isArray(template.fields)) {
          parsedFields = template.fields
        }
      }
      
      return {
        ...template,
        fields: parsedFields
      } as FormTemplateWithFields
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
