import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useFormTemplates, CATEGORY_LABELS } from '@/hooks/useFormTemplates'
import { FormularCard } from './FormularCard'
import { cn } from '@/lib/utils'

type CategoryFilter = 'all' | string

// Map slug to route
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

export function FormulareSection() {
  const { data: templates, isLoading, error } = useFormTemplates()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get unique categories
  const categories = templates
    ? [...new Set(templates.map(t => t.category))].sort()
    : []

  // Filter templates by category and search
  const filteredTemplates = templates?.filter(t => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter
    const matchesSearch = searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  }) || []

  // Get suggestions (top 5 matches for autocomplete)
  const suggestions = searchQuery.length >= 2 
    ? (templates?.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || []).slice(0, 5)
    : []

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      window.location.href = getHref(suggestions[selectedIndex].slug)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

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
      {/* Search Field with Autocomplete */}
      <div className="max-w-2xl mx-auto mb-12" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Welches Formular möchten Sie erstellen? z.B. Mietvertrag, Kündigung..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSuggestions(e.target.value.length >= 2)
              setSelectedIndex(-1)
            }}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className={cn(
              "pl-12 pr-12 py-6 text-lg border-2 border-muted bg-background shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
              showSuggestions && suggestions.length > 0 ? "rounded-t-2xl rounded-b-none border-b-0" : "rounded-full"
            )}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full z-10"
              onClick={() => {
                setSearchQuery('')
                setShowSuggestions(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute w-full bg-background border-2 border-t-0 border-muted rounded-b-2xl shadow-lg overflow-hidden z-20">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={suggestion.id}
                  to={getHref(suggestion.slug)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group",
                    index === selectedIndex && "bg-muted/50"
                  )}
                  onClick={() => setShowSuggestions(false)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{suggestion.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {CATEGORY_LABELS[suggestion.category] || suggestion.category}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              ))}
              {filteredTemplates.length > 5 && (
                <div className="px-4 py-2 text-xs text-muted-foreground border-t bg-muted/30">
                  {filteredTemplates.length - 5} weitere Ergebnisse unten
                </div>
              )}
            </div>
          )}
        </div>
        {searchQuery && !showSuggestions && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'Ergebnis' : 'Ergebnisse'} für "{searchQuery}"
          </p>
        )}
      </div>

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
          {searchQuery 
            ? `Keine Formulare für "${searchQuery}" gefunden.`
            : 'Keine Formulare in dieser Kategorie gefunden.'}
        </div>
      )}
    </section>
  )
}
