import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { PropertyLayout } from '@/components/PropertyLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Plus, MapPin, Home, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Building {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  total_units: number;
  total_area: number | null;
  year_built: number | null;
  created_at: string;
}

export default function Buildings() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    total_area: '',
    year_built: '',
  });

  useEffect(() => {
    if (!authLoading && !profile?.organization_id) {
      navigate('/organization/setup');
      return;
    }
    if (profile?.organization_id) {
      fetchBuildings();
    }
  }, [profile, authLoading, navigate]);

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      toast.error('Fehler beim Laden der Gebäude');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.organization_id) return;

    setSaving(true);
    try {
      const buildingData = {
        organization_id: profile.organization_id,
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        postal_code: formData.postal_code.trim() || null,
        total_area: formData.total_area ? parseFloat(formData.total_area) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
      };

      if (editingBuilding) {
        const { error } = await supabase
          .from('buildings')
          .update(buildingData)
          .eq('id', editingBuilding.id);
        if (error) throw error;
        toast.success('Gebäude aktualisiert');
      } else {
        const { error } = await supabase
          .from('buildings')
          .insert(buildingData);
        if (error) throw error;
        toast.success('Gebäude erstellt');
      }

      setDialogOpen(false);
      resetForm();
      fetchBuildings();
    } catch (error: any) {
      console.error('Error saving building:', error);
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (building: Building) => {
    setEditingBuilding(building);
    setFormData({
      name: building.name,
      address: building.address || '',
      city: building.city || '',
      postal_code: building.postal_code || '',
      total_area: building.total_area?.toString() || '',
      year_built: building.year_built?.toString() || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie dieses Gebäude wirklich löschen? Alle zugehörigen Einheiten werden ebenfalls gelöscht.')) {
      return;
    }

    try {
      const { error } = await supabase.from('buildings').delete().eq('id', id);
      if (error) throw error;
      toast.success('Gebäude gelöscht');
      fetchBuildings();
    } catch (error) {
      console.error('Error deleting building:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      postal_code: '',
      total_area: '',
      year_built: '',
    });
    setEditingBuilding(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) resetForm();
  };

  if (authLoading || loading) {
    return (
      <PropertyLayout>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Card>
            <CardContent className="p-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mb-2" />
              ))}
            </CardContent>
          </Card>
        </div>
      </PropertyLayout>
    );
  }

  return (
    <PropertyLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Gebäude</h2>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Immobilien und deren Einheiten
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Neues Gebäude
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingBuilding ? 'Gebäude bearbeiten' : 'Neues Gebäude anlegen'}
                </DialogTitle>
                <DialogDescription>
                  Geben Sie die Daten des Gebäudes ein.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="z.B. Mehrfamilienhaus Hauptstraße"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    placeholder="Straße und Hausnummer"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">PLZ</Label>
                    <Input
                      id="postal_code"
                      placeholder="12345"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Stadt</Label>
                    <Input
                      id="city"
                      placeholder="Berlin"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_area">Gesamtfläche (m²)</Label>
                    <Input
                      id="total_area"
                      type="number"
                      step="0.01"
                      placeholder="500"
                      value={formData.total_area}
                      onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year_built">Baujahr</Label>
                    <Input
                      id="year_built"
                      type="number"
                      placeholder="1990"
                      value={formData.year_built}
                      onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      editingBuilding ? 'Aktualisieren' : 'Erstellen'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {buildings.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Noch keine Gebäude</CardTitle>
              <CardDescription>
                Erstellen Sie Ihr erstes Gebäude, um mit der Verwaltung zu beginnen.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead className="text-right">Einheiten</TableHead>
                  <TableHead className="text-right">Fläche</TableHead>
                  <TableHead className="text-right">Baujahr</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildings.map((building) => (
                  <TableRow 
                    key={building.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/property/buildings/${building.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {building.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {building.address ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {building.address}, {building.postal_code} {building.city}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Home className="h-3 w-3 text-muted-foreground" />
                        {building.total_units}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {building.total_area ? `${building.total_area} m²` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {building.year_built || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(building)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(building.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </PropertyLayout>
  );
}
