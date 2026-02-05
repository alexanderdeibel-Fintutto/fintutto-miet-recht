import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Home, ArrowLeft, Construction, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/integrations/supabase/client'

export default function GenericForm() {
  const { slug } = useParams<{ slug: string }>()

  const { data: template, isLoading, error } = useQuery({
    queryKey: ['form-template', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_form_templates_public')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Lade Formular...</div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Link to="/formulare">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Formular nicht gefunden</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground mb-4">
            Das Formular "{slug}" wurde nicht gefunden.
          </p>
          <Link to="/formulare">
            <Button>Zurück zur Übersicht</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/formulare">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{template.name}</h1>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/meine-dokumente">
                <Button variant="ghost">Meine Dokumente</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Coming Soon Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Construction className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">{template.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-2">
                {template.tier === 'premium' && (
                  <Badge>Premium</Badge>
                )}
                {template.tier === 'free' && (
                  <Badge variant="secondary">Gratis</Badge>
                )}
                {template.tier === 'basic' && (
                  <Badge variant="outline">Basic</Badge>
                )}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 font-medium mb-1">
                  Formular in Entwicklung
                </p>
                <p className="text-amber-700 text-sm">
                  Dieses Formular wird derzeit entwickelt und steht in Kürze zur Verfügung. 
                  Bitte schauen Sie später wieder vorbei oder nutzen Sie eines unserer 
                  bereits verfügbaren Formulare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/formulare">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Alle Formulare ansehen
                  </Button>
                </Link>
                <Link to="/formulare/mietvertrag">
                  <Button className="w-full sm:w-auto">
                    Mietvertrag erstellen
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
