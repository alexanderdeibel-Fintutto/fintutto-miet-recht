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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Home, Plus, Building2, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { unitSchema } from '@/lib/validation';

interface Building {
  id: string;
  name: string;
}

interface Unit {
  id: string;
  building_id: string;
  unit_number: string;
  floor: number | null;
  area: number | null;
  rooms: number | null;
  type: string;
  status: string;
  created_at: string;
  buildings?: { name: string };
}

const statusColors: Record<string, string> = {
  available: 'bg-success text-success-foreground',
  rented: 'bg-primary text-primary-foreground',
  maintenance: 'bg-destructive text-destructive-foreground',
};

const statusLabels: Record<string, string> = {
  available: 'Verfügbar',
  rented: 'Vermietet',
  maintenance: 'In Wartung',
};

const typeLabels: Record<string, string> = {
  apartment: 'Wohnung',
  commercial: 'Gewerbe',
  parking: 'Stellplatz',
};

export default function Units() {
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [units, setUnits] = useState<Unit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    building_id: '',
    unit_number: '',
    floor: '',
    area: '',
    rooms: '',
    type: 'apartment',
    status: 'available',
  });

  useEffect(() => {
    if (!authLoading && !profile?.organization_id) {
      navigate('/organization/setup');
      return;
    }
    if (profile?.organization_id) {
      fetchData();
    }
  }, [profile, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [unitsRes, buildingsRes] = await Promise.all([
        supabase
          .from('units')
          .select('*, buildings(name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('buildings')
          .select('id, name')
          .order('name'),
      ]);

      if (unitsRes.error) throw unitsRes.error;
      if (buildingsRes.error) throw buildingsRes.error;

      setUnits(unitsRes.data || []);
      setBuildings(buildingsRes.data || []);
    } catch (error) {
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with zod
    const result = unitSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          errors[String(err.path[0])] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setSaving(true);
    
    try {
      const unitData = {
        building_id: result.data.building_id,
        unit_number: result.data.unit_number,
        floor: result.data.floor,
        area: result.data.area,
        rooms: result.data.rooms,
        type: result.data.type,
        status: result.data.status,
      };

      if (editingUnit) {
        const { error } = await supabase
          .from('units')
          .update(unitData)
          .eq('id', editingUnit.id);
        if (error) throw error;
        toast.success('Einheit aktualisiert');
      } else {
        const { error } = await supabase.from('units').insert(unitData);
        if (error) throw error;
        toast.success('Einheit erstellt');
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      building_id: unit.building_id,
      unit_number: unit.unit_number,
      floor: unit.floor?.toString() || '',
      area: unit.area?.toString() || '',
      rooms: unit.rooms?.toString() || '',
      type: unit.type,
      status: unit.status,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Einheit wirklich löschen?')) return;

    try {
      const { error } = await supabase.from('units').delete().eq('id', id);
      if (error) throw error;
      toast.success('Einheit gelöscht');
      fetchData();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  const resetForm = () => {
    setFormData({
      building_id: '',
      unit_number: '',
      floor: '',
      area: '',
      rooms: '',
      type: 'apartment',
      status: 'available',
    });
    setEditingUnit(null);
    setValidationErrors({});
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
            <h2 className="text-2xl font-bold">Einheiten</h2>
            <p className="text-muted-foreground">
              Verwalten Sie Wohnungen, Gewerbeeinheiten und Stellplätze
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button disabled={buildings.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Neue Einheit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUnit ? 'Einheit bearbeiten' : 'Neue Einheit anlegen'}
                </DialogTitle>
                <DialogDescription>
                  Geben Sie die Daten der Einheit ein.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Gebäude *</Label>
                  <Select
                    value={formData.building_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, building_id: value });
                      setValidationErrors({ ...validationErrors, building_id: '' });
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gebäude auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.building_id && (
                    <p className="text-sm text-destructive">{validationErrors.building_id}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit_number">Einheitennummer *</Label>
                    <Input
                      id="unit_number"
                      placeholder="z.B. 1.OG links"
                      value={formData.unit_number}
                      onChange={(e) => {
                        setFormData({ ...formData, unit_number: e.target.value });
                        setValidationErrors({ ...validationErrors, unit_number: '' });
                      }}
                      maxLength={50}
                      required
                    />
                    {validationErrors.unit_number && (
                      <p className="text-sm text-destructive">{validationErrors.unit_number}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Etage</Label>
                    <Input
                      id="floor"
                      type="number"
                      min="-10"
                      max="200"
                      placeholder="1"
                      value={formData.floor}
                      onChange={(e) => {
                        setFormData({ ...formData, floor: e.target.value });
                        setValidationErrors({ ...validationErrors, floor: '' });
                      }}
                    />
                    {validationErrors.floor && (
                      <p className="text-sm text-destructive">{validationErrors.floor}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Fläche (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10000"
                      placeholder="75"
                      value={formData.area}
                      onChange={(e) => {
                        setFormData({ ...formData, area: e.target.value });
                        setValidationErrors({ ...validationErrors, area: '' });
                      }}
                    />
                    {validationErrors.area && (
                      <p className="text-sm text-destructive">{validationErrors.area}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Zimmer</Label>
                    <Input
                      id="rooms"
                      type="number"
                      step="0.5"
                      min="0"
                      max="50"
                      placeholder="3"
                      value={formData.rooms}
                      onChange={(e) => {
                        setFormData({ ...formData, rooms: e.target.value });
                        setValidationErrors({ ...validationErrors, rooms: '' });
                      }}
                    />
                    {validationErrors.rooms && (
                      <p className="text-sm text-destructive">{validationErrors.rooms}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Art</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Wohnung</SelectItem>
                        <SelectItem value="commercial">Gewerbe</SelectItem>
                        <SelectItem value="parking">Stellplatz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Verfügbar</SelectItem>
                        <SelectItem value="rented">Vermietet</SelectItem>
                        <SelectItem value="maintenance">In Wartung</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={saving || !formData.building_id}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Speichern...
                      </>
                    ) : (
                      editingUnit ? 'Aktualisieren' : 'Erstellen'
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
              <CardTitle>Zuerst ein Gebäude anlegen</CardTitle>
              <CardDescription>
                Bevor Sie Einheiten erstellen können, müssen Sie mindestens ein Gebäude anlegen.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/property/buildings')}>
                <Building2 className="mr-2 h-4 w-4" />
                Zu den Gebäuden
              </Button>
            </CardContent>
          </Card>
        ) : units.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Noch keine Einheiten</CardTitle>
              <CardDescription>
                Erstellen Sie Ihre erste Einheit, um mit der Verwaltung zu beginnen.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Einheit</TableHead>
                  <TableHead>Gebäude</TableHead>
                  <TableHead>Art</TableHead>
                  <TableHead className="text-right">Fläche</TableHead>
                  <TableHead className="text-right">Zimmer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        {unit.unit_number}
                        {unit.floor !== null && (
                          <span className="text-xs text-muted-foreground">
                            ({unit.floor}. OG)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {unit.buildings?.name}
                      </div>
                    </TableCell>
                    <TableCell>{typeLabels[unit.type] || unit.type}</TableCell>
                    <TableCell className="text-right">
                      {unit.area ? `${unit.area} m²` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {unit.rooms || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[unit.status]}>
                        {statusLabels[unit.status] || unit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(unit)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(unit.id)}>
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
