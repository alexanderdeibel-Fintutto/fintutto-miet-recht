import { Link } from 'react-router-dom'
import {
  FileText,
  FileSignature,
  ClipboardList,
  Euro,
  AlertTriangle,
  Key,
  Users,
  Home,
  Calendar,
  Mail,
  Shield,
  Scale,
  Briefcase,
  FileCheck,
  type LucideIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FormTemplate, TIER_CONFIG, PERSONA_LABELS } from '@/hooks/useFormTemplates'

// Icon mapping based on slug patterns
const getIconForSlug = (slug: string): LucideIcon => {
  if (slug.includes('mietvertrag') || slug.includes('vertrag')) return FileSignature
  if (slug.includes('kuendigung')) return FileText
  if (slug.includes('uebergabe') || slug.includes('protokoll')) return ClipboardList
  if (slug.includes('nebenkosten') || slug.includes('abrechnung') || slug.includes('heizkosten')) return Euro
  if (slug.includes('maengel') || slug.includes('mahnung')) return AlertTriangle
  if (slug.includes('schluessel') || slug.includes('kaution')) return Key
  if (slug.includes('selbstauskunft') || slug.includes('vollmacht')) return Users
  if (slug.includes('wohnung') || slug.includes('haus')) return Home
  if (slug.includes('termin') || slug.includes('besichtigung')) return Calendar
  if (slug.includes('sepa') || slug.includes('zahlung')) return Euro
  if (slug.includes('bescheinigung') || slug.includes('bestaetigung')) return FileCheck
  if (slug.includes('mieterhoehung')) return Scale
  if (slug.includes('gewerbe')) return Briefcase
  if (slug.includes('datenschutz')) return Shield
  return FileText
}

interface FormularCardProps {
  template: FormTemplate
}

export function FormularCard({ template }: FormularCardProps) {
  const Icon = getIconForSlug(template.slug)
  const tierConfig = TIER_CONFIG[template.tier] || TIER_CONFIG.basic
  const personaLabel = PERSONA_LABELS[template.persona]

  // Map slug to route - some have dedicated pages, others go to generic form page
  const getHref = (slug: string) => {
    const dedicatedRoutes: Record<string, string> = {
      'mietvertrag-standard': '/formulare/mietvertrag',
      'kuendigung-mieter': '/formulare/kuendigung',
      'kuendigung-vermieter': '/formulare/kuendigung',
      'uebergabeprotokoll': '/formulare/uebergabeprotokoll',
      'nebenkostenabrechnung': '/formulare/betriebskosten',
      'mieterhoehung': '/formulare/mieterhoehung',
      'mieterhoehung-standard': '/formulare/mieterhoehung',
      'maengelanzeige': '/formulare/maengelanzeige',
      'selbstauskunft': '/formulare/selbstauskunft',
      'untermietvertrag': '/formulare/untermietvertrag',
    }
    return dedicatedRoutes[slug] || `/formulare/${slug}`
  }

  return (
    <Link to={getHref(template.slug)}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {template.tier === 'premium' && (
                <Badge variant={tierConfig.variant} className="text-xs">
                  {tierConfig.label}
                </Badge>
              )}
              {template.tier === 'free' && (
                <Badge variant="secondary" className="text-xs">
                  Gratis
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-base leading-tight mt-2">{template.name}</CardTitle>
          <CardDescription className="text-xs line-clamp-2">
            {template.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {personaLabel && (
            <Badge variant="outline" className="text-xs">
              {personaLabel}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
