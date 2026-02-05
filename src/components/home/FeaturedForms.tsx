import { Link } from 'react-router-dom'
import { 
  Star, 
  ArrowRight, 
  FileText, 
  FileSignature, 
  ClipboardList, 
  Receipt, 
  AlertTriangle, 
  UserCheck,
  Euro,
  Key,
  Users,
  Home,
  Scale,
  Briefcase,
  FileCheck,
  Loader2,
  type LucideIcon
} from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useFeaturedForms, FeaturedForm } from '@/hooks/useFeaturedForms'

// Icon mapping based on slug patterns
const getIconForSlug = (slug: string): LucideIcon => {
  if (slug.includes('mietvertrag') || slug.includes('vertrag')) return FileSignature
  if (slug.includes('kuendigung')) return FileText
  if (slug.includes('uebergabe') || slug.includes('protokoll')) return ClipboardList
  if (slug.includes('nebenkosten') || slug.includes('abrechnung') || slug.includes('heizkosten')) return Receipt
  if (slug.includes('maengel') || slug.includes('mahnung')) return AlertTriangle
  if (slug.includes('schluessel') || slug.includes('kaution')) return Key
  if (slug.includes('selbstauskunft') || slug.includes('vollmacht')) return Users
  if (slug.includes('wohnung') || slug.includes('haus')) return Home
  if (slug.includes('sepa') || slug.includes('zahlung')) return Euro
  if (slug.includes('bescheinigung') || slug.includes('bestaetigung')) return FileCheck
  if (slug.includes('mieterhoehung')) return Scale
  if (slug.includes('gewerbe')) return Briefcase
  return FileText
}

// Route mapping for forms
const getHref = (slug: string): string => {
  const dedicatedRoutes: Record<string, string> = {
    'mietvertrag-standard': '/formulare/mietvertrag',
    'mietvertrag-moebliert': '/formulare/mietvertrag',
    'mietvertrag-wg': '/formulare/mietvertrag',
    'mietvertrag-gewerbe': '/formulare/mietvertrag',
    'kuendigung-mieter': '/formulare/kuendigung',
    'kuendigung-vermieter': '/formulare/kuendigung',
    'uebergabeprotokoll': '/formulare/uebergabeprotokoll',
    'nebenkostenabrechnung': '/formulare/betriebskosten',
    'mieterhoehung': '/formulare/mieterhoehung',
    'maengelanzeige': '/formulare/maengelanzeige',
    'selbstauskunft': '/formulare/selbstauskunft',
    'untermietvertrag': '/formulare/untermietvertrag',
  }
  return dedicatedRoutes[slug] || `/formulare/${slug}`
}

// Badge based on ranking position
const getBadge = (index: number, usageCount: number): string | null => {
  if (usageCount > 5) return 'Trending'
  if (index === 0) return 'Beliebt'
  if (index === 1) return 'Top'
  if (index === 2) return 'Wichtig'
  return null
}

export function FeaturedForms() {
  const { data: featuredForms, isLoading, error } = useFeaturedForms(6)

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (error || !featuredForms?.length) {
    return null // Graceful fallback - don't show section if no data
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <Star className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Beliebte Formulare</h3>
            <p className="text-muted-foreground">Die am häufigsten genutzten Dokumente</p>
          </div>
        </div>
        <Link to="/formulare" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          Alle Formulare
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredForms.map((form, index) => {
          const Icon = getIconForSlug(form.slug)
          const badge = getBadge(index, form.usage_count)
          
          return (
            <Link key={form.slug} to={getHref(form.slug)}>
              <Card 
                className="h-full hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group animate-fade-in opacity-0"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {badge && (
                      <Badge variant="secondary" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors duration-300">
                    {form.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {form.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
