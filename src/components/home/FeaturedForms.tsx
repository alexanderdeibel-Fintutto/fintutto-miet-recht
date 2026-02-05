import { Link } from 'react-router-dom'
import { Star, ArrowRight, FileText, FileSignature, ClipboardList, Receipt, AlertTriangle, UserCheck, Home as HomeIcon, CreditCard } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FEATURED_FORMS = [
  {
    slug: 'mietvertrag-standard',
    href: '/formulare/mietvertrag',
    title: 'Mietvertrag',
    description: 'Rechtssicherer Wohnraummietvertrag',
    icon: FileSignature,
    badge: 'Beliebt',
  },
  {
    slug: 'kuendigung-mieter',
    href: '/formulare/kuendigung',
    title: 'Kündigung (Mieter)',
    description: 'Ordentliche Kündigung des Mietverhältnisses',
    icon: FileText,
    badge: 'Top',
  },
  {
    slug: 'uebergabeprotokoll',
    href: '/formulare/uebergabeprotokoll',
    title: 'Übergabeprotokoll',
    description: 'Dokumentation bei Ein- und Auszug',
    icon: ClipboardList,
    badge: 'Wichtig',
  },
  {
    slug: 'nebenkostenabrechnung',
    href: '/formulare/betriebskosten',
    title: 'Nebenkostenabrechnung',
    description: 'Jährliche Betriebskostenabrechnung',
    icon: Receipt,
  },
  {
    slug: 'maengelanzeige',
    href: '/formulare/maengelanzeige',
    title: 'Mängelanzeige',
    description: 'Mängel rechtssicher melden',
    icon: AlertTriangle,
  },
  {
    slug: 'mieterselbstauskunft',
    href: '/formulare/selbstauskunft',
    title: 'Selbstauskunft',
    description: 'Formular für Mietinteressenten',
    icon: UserCheck,
  },
]

export function FeaturedForms() {
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
        {FEATURED_FORMS.map((form, index) => (
          <Link key={form.slug} to={form.href}>
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
                    <form.icon className="h-5 w-5 text-primary" />
                  </div>
                  {form.badge && (
                    <Badge variant="secondary" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {form.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors duration-300">
                  {form.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {form.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
