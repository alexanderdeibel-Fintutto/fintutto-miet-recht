import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { PersonaTabs } from '@/components/shop/PersonaTabs';
import { SearchBar } from '@/components/shop/SearchBar';
import { FormCard } from '@/components/shop/FormCard';
import { BundleCard } from '@/components/shop/BundleCard';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowRight, 
  FileText, 
  Shield, 
  Clock, 
  Download,
  CheckCircle2,
  Star
} from 'lucide-react';
import { useFormTemplates } from '@/hooks/useFormTemplates';
import { useBundles } from '@/hooks/useBundles';

export default function ShopLanding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('alle');

  // Fetch popular forms
  const { data: popularForms, isLoading: isLoadingForms } = useFormTemplates({
    persona: selectedPersona === 'alle' ? undefined : selectedPersona,
    search: searchQuery || undefined,
    limit: 6,
    sortBy: 'popular',
  });

  // Fetch bundles
  const { data: bundles, isLoading: isLoadingBundles } = useBundles();

  const faqs = [
    {
      question: 'Wie funktioniert der Formular-Generator?',
      answer: 'Wählen Sie ein Formular aus, füllen Sie die erforderlichen Felder aus, und laden Sie das fertige Dokument als PDF herunter. Alle Eingaben werden automatisch gespeichert.',
    },
    {
      question: 'Sind die Formulare rechtssicher?',
      answer: 'Ja, alle Formulare wurden von Rechtsexperten geprüft und entsprechen dem aktuellen deutschen Mietrecht. Wir aktualisieren sie regelmäßig bei Gesetzesänderungen.',
    },
    {
      question: 'Kann ich ein Formular nach dem Kauf mehrfach verwenden?',
      answer: 'Ja, einmal gekaufte Formulare können Sie unbegrenzt oft verwenden und herunterladen.',
    },
    {
      question: 'Was ist in einem Bundle enthalten?',
      answer: 'Bundles enthalten mehrere thematisch zusammengehörige Formulare zu einem vergünstigten Preis. Sie sparen damit gegenüber dem Einzelkauf.',
    },
    {
      question: 'Wie kann ich bezahlen?',
      answer: 'Wir akzeptieren alle gängigen Zahlungsmethoden über unseren sicheren Zahlungsanbieter Stripe: Kreditkarte, SEPA-Lastschrift, Giropay und mehr.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader 
        onSearch={setSearchQuery} 
        searchValue={searchQuery}
        showSearch={false}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              60+ <span className="gradient-text">Formulare</span> für Vermieter & Mieter
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Rechtssichere Mietverträge, Kündigungen, Protokolle und mehr. 
              Einfach ausfüllen, herunterladen und nutzen.
            </p>
            
            {/* Search */}
            <div className="max-w-xl mx-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Welches Formular suchen Sie?"
                size="lg"
              />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <span>Rechtssicher</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Sofort verfügbar</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-secondary" />
                <span>PDF-Download</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Tabs & Forms Grid */}
      <section className="py-12 md:py-16">
        <div className="container space-y-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              Beliebte Formulare
            </h2>
            <PersonaTabs 
              value={selectedPersona} 
              onValueChange={setSelectedPersona} 
            />
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingForms ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
              ))
            ) : popularForms?.length ? (
              popularForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Formulare gefunden</p>
              </div>
            )}
          </div>

          {/* View all link */}
          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to={selectedPersona === 'alle' ? '/vermieter' : `/${selectedPersona}`}>
                Alle Formulare ansehen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bundles Section */}
      <section id="bundles" className="py-12 md:py-16 bg-muted/50">
        <div className="container space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Formular-Bundles
            </h2>
            <p className="text-muted-foreground">
              Sparen Sie mit unseren thematischen Paketen
            </p>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingBundles ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-32 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
              ))
            ) : bundles?.length ? (
              bundles.slice(0, 3).map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Professionelle Vorlagen</h3>
              <p className="text-muted-foreground text-sm">
                Von Juristen geprüfte Formulare nach aktuellem deutschem Recht
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg">Einfache Bedienung</h3>
              <p className="text-muted-foreground text-sm">
                Schritt für Schritt durch das Formular mit Live-Vorschau
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">Unbegrenzte Nutzung</h3>
              <p className="text-muted-foreground text-sm">
                Einmal kaufen, beliebig oft verwenden und anpassen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Häufig gestellte Fragen
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
