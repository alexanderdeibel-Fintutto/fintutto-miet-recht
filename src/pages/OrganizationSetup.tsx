import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationSetup() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<string>('');

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !orgName.trim()) return;

    setLoading(true);
    try {
      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName.trim(),
          type: orgType || null,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Update user profile with organization_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ organization_id: org.id })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Role assignment is handled automatically by database trigger
      // when organization_id is set on profile

      await refreshProfile();
      toast.success('Organisation erfolgreich erstellt!');
      navigate('/property');
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error('Fehler beim Erstellen der Organisation');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard/formulare');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Immobilienverwaltung einrichten</CardTitle>
          <CardDescription>
            Erstellen Sie eine Organisation, um Ihre Immobilien, Mieter und Verträge zu verwalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrganization} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName">Name der Organisation *</Label>
              <Input
                id="orgName"
                placeholder="z.B. Müller Immobilien GmbH"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgType">Art der Organisation</Label>
              <Select value={orgType} onValueChange={setOrgType}>
                <SelectTrigger>
                  <SelectValue placeholder="Bitte auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vermieter">Privater Vermieter</SelectItem>
                  <SelectItem value="hausverwaltung">Hausverwaltung</SelectItem>
                  <SelectItem value="makler">Immobilienmakler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={loading || !orgName.trim()} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    Organisation erstellen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={handleSkip}>
                Später einrichten
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
