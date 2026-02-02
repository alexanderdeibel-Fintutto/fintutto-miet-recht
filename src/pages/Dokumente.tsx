import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calculator, Trash2, Eye, Edit, Download, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Document {
  id: string;
  title: string;
  type: string;
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

interface Calculation {
  id: string;
  title: string;
  type: string;
  created_at: string;
}

type ItemType = 'all' | 'documents' | 'calculations';

export default function Dokumente() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ItemType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    const [docsResult, calcsResult] = await Promise.all([
      supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('calculations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    if (docsResult.data) setDocuments(docsResult.data);
    if (calcsResult.data) setCalculations(calcsResult.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDeleteDocument = async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Fehler', description: 'Dokument konnte nicht gelöscht werden.' });
    } else {
      toast({ title: 'Gelöscht', description: 'Dokument wurde erfolgreich gelöscht.' });
      fetchData();
    }
  };

  const handleDeleteCalculation = async (id: string) => {
    const { error } = await supabase.from('calculations').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Fehler', description: 'Berechnung konnte nicht gelöscht werden.' });
    } else {
      toast({ title: 'Gelöscht', description: 'Berechnung wurde erfolgreich gelöscht.' });
      fetchData();
    }
  };

  const allItems = [
    ...documents.map((d) => ({ ...d, itemType: 'document' as const })),
    ...calculations.map((c) => ({ ...c, itemType: 'calculation' as const, is_draft: false, updated_at: c.created_at })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredItems = allItems.filter((item) => {
    const matchesType = filterType === 'all' || 
      (filterType === 'documents' && item.itemType === 'document') ||
      (filterType === 'calculations' && item.itemType === 'calculation');
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meine Dokumente</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre gespeicherten Formulare und Berechnungen.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterType} onValueChange={(v) => setFilterType(v as ItemType)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="documents">Formulare</SelectItem>
                  <SelectItem value="calculations">Berechnungen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="card-shadow">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Dokumente gefunden.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Erstellt am</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.itemType === 'document' ? (
                            <FileText className="h-4 w-4 text-primary" />
                          ) : (
                            <Calculator className="h-4 w-4 text-secondary" />
                          )}
                          {item.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.itemType === 'document' ? 'Formular' : 'Berechnung'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.is_draft ? (
                          <Badge variant="secondary">Entwurf</Badge>
                        ) : (
                          <Badge variant="default" className="bg-success">Fertig</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.created_at), 'dd. MMM yyyy', { locale: de })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Löschen bestätigen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Möchten Sie "{item.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    item.itemType === 'document'
                                      ? handleDeleteDocument(item.id)
                                      : handleDeleteCalculation(item.id)
                                  }
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Löschen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
