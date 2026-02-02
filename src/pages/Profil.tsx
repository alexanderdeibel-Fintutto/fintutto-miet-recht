import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Mail, User, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Profil() {
  const { user, profile, signOut, isPremium } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showUpgrade = searchParams.get('upgrade') === 'true';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>Ihre Kontoinformationen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{profile?.full_name || 'Unbekannt'}</p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Mitglied seit</span>
              <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Abonnement</span>
              {isPremium ? (
                <Badge className="bg-secondary">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="outline">Kostenlos</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Card */}
        {!isPremium && (
          <Card className={`card-shadow border-secondary ${showUpgrade ? 'ring-2 ring-secondary' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Crown className="h-5 w-5" />
                Upgrade auf Premium
              </CardTitle>
              <CardDescription>Schalten Sie alle Funktionen frei</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-3xl font-bold">
                  €9,99<span className="text-lg font-normal text-muted-foreground">/Monat</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Alle 15+ Formulare freigeschaltet
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Unbegrenzt Dokumente speichern
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Professioneller PDF-Export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Prioritäts-Support
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Jetzt upgraden
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                Stripe-Integration folgt in Kürze
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
