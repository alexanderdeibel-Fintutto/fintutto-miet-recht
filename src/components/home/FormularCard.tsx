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
import { cn } from '@/lib/utils'

// Category-based color themes
const CATEGORY_THEMES: Record<string, { gradient: string; iconBg: string; iconColor: string }> = {
  vertraege: {
    gradient: 'from-blue-500/20 via-blue-400/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconColor: 'text-white'
  },
  schreiben: {
    gradient: 'from-violet-500/20 via-violet-400/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    iconColor: 'text-white'
  },
  protokolle: {
    gradient: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconColor: 'text-white'
  },
  abrechnungen: {
    gradient: 'from-amber-500/20 via-amber-400/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    iconColor: 'text-white'
  },
  sonstige: {
    gradient: 'from-slate-500/20 via-slate-400/10 to-transparent',
    iconBg: 'bg-gradient-to-br from-slate-500 to-slate-600',
    iconColor: 'text-white'
  },
}

const DEFAULT_THEME = {
  gradient: 'from-primary/20 via-primary/10 to-transparent',
  iconBg: 'bg-gradient-to-br from-primary to-primary/80',
  iconColor: 'text-white'
}

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
  const theme = CATEGORY_THEMES[template.category] || DEFAULT_THEME

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
    <Link to={getHref(template.slug)} className="block h-full">
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-md hover:-translate-y-1">
        {/* Gradient Header */}
        <div className={cn(
          "h-20 relative bg-gradient-to-br",
          theme.gradient,
          "flex items-center justify-center"
        )}>
          {/* Icon Container */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
            "transform group-hover:scale-110 transition-transform duration-300",
            theme.iconBg
          )}>
            <Icon className={cn("h-7 w-7", theme.iconColor)} />
          </div>
          
          {/* Tier Badge - Top Right */}
          <div className="absolute top-2 right-2">
            {template.tier === 'premium' && (
              <Badge variant={tierConfig.variant} className="text-xs font-medium shadow-sm">
                {tierConfig.label}
              </Badge>
            )}
            {template.tier === 'free' && (
              <Badge variant="secondary" className="text-xs font-medium bg-white/90 shadow-sm">
                Gratis
              </Badge>
            )}
          </div>
        </div>
        
        {/* Content */}
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {template.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4">
          <CardDescription className="text-xs line-clamp-2 mb-3">
            {template.description}
          </CardDescription>
          {personaLabel && (
            <Badge variant="outline" className="text-xs bg-muted/50">
              {personaLabel}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
