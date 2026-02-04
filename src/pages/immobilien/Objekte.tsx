import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { BuildingForm } from '@/components/property/BuildingForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Plus, MapPin, Home, Loader2 } from 'lucide-react'

export default function Objekte() {
  const [showForm, setShowForm] = useState(false)

  // Get user's organization
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      
      const { data } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()
      
      return data
    },
  })

  // Get buildings for the organization
  const { data: buildings, isLoading: buildingsLoading, refetch } = useQuery({
    queryKey: ['buildings', profile?.organization_id],
    queryFn: async () => {
      if (!profile?.organization_id) return []
      
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!profile?.organization_id,
  })

  const isLoading = profileLoading || buildingsLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile?.organization_id) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Organisation erforderlich</CardTitle>
              <CardDescription>
                Sie müssen zuerst eine Organisation erstellen, um Gebäude verwalten zu können.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Organisation erstellen</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              Meine Objekte
            </h1>
            <p className="text-muted-foreground mt-1">
              Verwalten Sie Ihre Immobilien und Gebäude
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Neues Gebäude
            </Button>
          )}
        </div>

        {showForm ? (
          <div className="max-w-2xl">
            <BuildingForm
              organizationId={profile.organization_id}
              onSuccess={() => {
                setShowForm(false)
                refetch()
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : buildings && buildings.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {buildings.map((building) => (
              <Card key={building.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {building.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {building.address}, {building.postal_code} {building.city}
                    </span>
                  </div>
                  {building.total_units && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>{building.total_units} Einheiten</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="max-w-lg">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Noch keine Gebäude</h3>
              <p className="text-muted-foreground mb-4">
                Erstellen Sie Ihr erstes Gebäude, um mit der Verwaltung zu beginnen.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Erstes Gebäude anlegen
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  )
}
