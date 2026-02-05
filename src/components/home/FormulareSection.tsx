import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFormTemplates, CATEGORY_LABELS } from '@/hooks/useFormTemplates'
import { FormularCard } from './FormularCard'

type CategoryFilter = 'all' | string

export function FormulareSection() {
  const { data: templates, isLoading, error } = useFormTemplates()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')

  // Get unique categories
  const categories = templates
    ? [...new Set(templates.map(t => t.category))].sort()
    : []

  // Filter templates
  const filteredTemplates = templates?.filter(t => 
    categoryFilter === 'all' || t.category === categoryFilter
  ) || []

  if (isLoading) {
    return (
      <section id="formulare" className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="formulare" className="container mx-auto px-4 py-16">
        <div className="text-center py-12 text-muted-foreground">
          Formulare konnten nicht geladen werden.
        </div>
      </section>
    )
  }

  return (
    <section id="formulare" className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Formulare & Verträge</h3>
            <p className="text-muted-foreground">
              {templates?.length || 0} Formulare verfügbar – wählen Sie das passende für Ihr Anliegen
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Formular' : 'Formulare'}
          </Badge>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
          >
            Alle
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(category)}
            >
              {CATEGORY_LABELS[category] || category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredTemplates.map((template) => (
          <FormularCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Keine Formulare in dieser Kategorie gefunden.
        </div>
      )}
    </section>
  )
}
