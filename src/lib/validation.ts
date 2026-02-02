import { z } from 'zod';

// Organization validation schema
export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name muss mindestens 2 Zeichen haben')
    .max(100, 'Name darf maximal 100 Zeichen haben'),
  type: z
    .enum(['vermieter', 'hausverwaltung', 'makler', ''])
    .optional()
    .transform(val => val || null),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Building validation schema
export const buildingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name muss mindestens 2 Zeichen haben')
    .max(100, 'Name darf maximal 100 Zeichen haben'),
  address: z
    .string()
    .trim()
    .max(200, 'Adresse darf maximal 200 Zeichen haben')
    .optional()
    .transform(val => val || null),
  city: z
    .string()
    .trim()
    .max(100, 'Stadt darf maximal 100 Zeichen haben')
    .optional()
    .transform(val => val || null),
  postal_code: z
    .string()
    .trim()
    .max(10, 'PLZ darf maximal 10 Zeichen haben')
    .regex(/^[0-9]{0,10}$/, 'PLZ darf nur Zahlen enthalten')
    .optional()
    .transform(val => val || null),
  total_area: z
    .string()
    .optional()
    .transform(val => {
      if (!val || val.trim() === '') return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine(val => val === null || (val > 0 && val <= 100000), {
      message: 'Fläche muss zwischen 0 und 100.000 m² liegen',
    }),
  year_built: z
    .string()
    .optional()
    .transform(val => {
      if (!val || val.trim() === '') return null;
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    })
    .refine(val => {
      if (val === null) return true;
      const currentYear = new Date().getFullYear();
      return val >= 1800 && val <= currentYear + 5;
    }, {
      message: `Baujahr muss zwischen 1800 und ${new Date().getFullYear() + 5} liegen`,
    }),
});

export type BuildingFormData = z.infer<typeof buildingSchema>;

// Unit validation schema
export const unitSchema = z.object({
  building_id: z
    .string()
    .uuid('Bitte wählen Sie ein Gebäude aus'),
  unit_number: z
    .string()
    .trim()
    .min(1, 'Einheitennummer ist erforderlich')
    .max(50, 'Einheitennummer darf maximal 50 Zeichen haben'),
  floor: z
    .string()
    .optional()
    .transform(val => {
      if (!val || val.trim() === '') return null;
      const num = parseInt(val, 10);
      return isNaN(num) ? null : num;
    })
    .refine(val => val === null || (val >= -10 && val <= 200), {
      message: 'Etage muss zwischen -10 und 200 liegen',
    }),
  area: z
    .string()
    .optional()
    .transform(val => {
      if (!val || val.trim() === '') return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine(val => val === null || (val > 0 && val <= 10000), {
      message: 'Fläche muss zwischen 0 und 10.000 m² liegen',
    }),
  rooms: z
    .string()
    .optional()
    .transform(val => {
      if (!val || val.trim() === '') return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    })
    .refine(val => val === null || (val > 0 && val <= 50), {
      message: 'Zimmeranzahl muss zwischen 0 und 50 liegen',
    }),
  type: z.enum(['apartment', 'commercial', 'parking']),
  status: z.enum(['available', 'rented', 'maintenance']),
});

export type UnitFormData = z.infer<typeof unitSchema>;

// Helper function to get error message from zod result
export function getValidationError(result: z.SafeParseReturnType<unknown, unknown>): string | null {
  if (result.success) return null;
  return result.error.errors[0]?.message || 'Ungültige Eingabe';
}
