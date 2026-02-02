import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PropertyLayout } from '@/components/PropertyLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Home, FileText, Users, Wrench, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  buildings: number;
  units: number;
  activeLeases: number;
  openTasks: number;
}

export default function PropertyDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !profile?.organization_id) {
      navigate('/organization/setup');
      return;
    }

    if (profile?.organization_id) {
      fetchStats();
    }
  }, [profile, authLoading, navigate]);

  const fetchStats = async () => {
    try {
      const [buildingsRes, unitsRes, leasesRes, tasksRes] = await Promise.all([
        supabase.from('buildings').select('id', { count: 'exact', head: true }),
        supabase.from('units').select('id', { count: 'exact', head: true }),
        supabase.from('leases').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      ]);

      setStats({
        buildings: buildingsRes.count || 0,
        units: unitsRes.count || 0,
        activeLeases: leasesRes.count || 0,
        openTasks: tasksRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <PropertyLayout>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </PropertyLayout>
    );
  }

  const statCards = [
    { 
      label: 'Gebäude', 
      value: stats?.buildings || 0, 
      icon: Building2, 
      href: '/property/buildings',
      color: 'text-primary'
    },
    { 
      label: 'Einheiten', 
      value: stats?.units || 0, 
      icon: Home, 
      href: '/property/units',
      color: 'text-secondary'
    },
    { 
      label: 'Aktive Mietverträge', 
      value: stats?.activeLeases || 0, 
      icon: FileText, 
      href: '/property/leases',
      color: 'text-success'
    },
    { 
      label: 'Offene Aufgaben', 
      value: stats?.openTasks || 0, 
      icon: Wrench, 
      href: '/property/tasks',
      color: 'text-destructive'
    },
  ];

  const isEmpty = stats && stats.buildings === 0;

  return (
    <PropertyLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card 
              key={stat.label} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(stat.href)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State / Quick Actions */}
        {isEmpty ? (
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Willkommen in Ihrer Immobilienverwaltung</CardTitle>
              <CardDescription>
                Beginnen Sie damit, Ihr erstes Gebäude hinzuzufügen, um Ihre Immobilien zu verwalten.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/property/buildings/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Erstes Gebäude anlegen
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schnellzugriff</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate('/property/buildings/new')}
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Neues Gebäude anlegen
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate('/property/leases/new')}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Neuen Mietvertrag erstellen
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate('/property/tasks/new')}
                >
                  <span className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Neue Aufgabe erstellen
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Letzte Aktivitäten</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aktivitäten werden hier angezeigt, sobald Sie Daten erfassen.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PropertyLayout>
  );
}
