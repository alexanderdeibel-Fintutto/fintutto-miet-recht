import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CategoryFilter } from '@/components/shop/CategoryFilter';
import { FormCard } from '@/components/shop/FormCard';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Building2, Home } from 'lucide-react';
import { useFormTemplates } from '@/hooks/useFormTemplates';

type SortOption = 'popular' | 'price' | 'name';

export default function CategoryPage() {
  const { persona } = useParams<{ persona: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('alle');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const currentPersona = persona || 'vermieter';
  const isVermieter = currentPersona === 'vermieter';

  const { data: forms, isLoading } = useFormTemplates({
    persona: currentPersona,
    category: category === 'alle' ? undefined : category,
    search: searchQuery || undefined,
    sortBy,
  });

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader 
        onSearch={setSearchQuery} 
        searchValue={searchQuery}
      />

      {/* Page Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            {isVermieter ? (
              <Building2 className="h-8 w-8 text-primary" />
            ) : (
              <Home className="h-8 w-8 text-primary" />
            )}
            <h1 className="text-3xl font-bold">
              Formulare für {isVermieter ? 'Vermieter' : 'Mieter'}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {isVermieter 
              ? 'Mietverträge, Kündigungen, Abrechnungen und mehr für professionelle Vermietung'
              : 'Kündigungen, Mängelanzeigen, Widersprüche und mehr für Ihre Rechte als Mieter'
            }
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b py-4 sticky top-16 bg-background/95 backdrop-blur z-40">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Category filter */}
            <div className="flex-1 overflow-x-auto pb-2 md:pb-0">
              <CategoryFilter 
                value={category} 
                onValueChange={setCategory} 
              />
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground">Sortieren:</span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Beliebt</SelectItem>
                  <SelectItem value="price">Preis</SelectItem>
                  <SelectItem value="name">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Grid */}
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))}
            </div>
          ) : forms?.length ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {forms.length} Formular{forms.length !== 1 ? 'e' : ''} gefunden
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {forms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">Keine Formulare gefunden</h2>
              <p className="text-muted-foreground mb-6">
                Versuchen Sie andere Filtereinstellungen oder eine andere Suche.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setCategory('alle');
                  setSearchQuery('');
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinTuttO. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
