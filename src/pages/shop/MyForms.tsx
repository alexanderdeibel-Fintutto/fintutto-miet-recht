import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ShoppingBag, 
  FileEdit, 
  FileCheck, 
  Download, 
  Trash2, 
  ExternalLink,
  FileText,
  Clock,
  Package
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPurchases } from '@/hooks/useFormAccess';
import { useUserDrafts } from '@/hooks/useFormDraft';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, FORM_TIERS } from '@/lib/formConstants';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

export default function MyForms() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('purchased');

  // Fetch purchases
  const { data: purchases, isLoading: isLoadingPurchases } = useUserPurchases();

  // Fetch drafts
  const { data: drafts, isLoading: isLoadingDrafts } = useUserDrafts();

  // Fetch generated documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['generated-documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase
        .from('user_form_drafts')
        .delete()
        .eq('id', draftId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-drafts'] });
      toast.success('Entwurf gelöscht');
    },
    onError: () => {
      toast.error('Fehler beim Löschen');
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (docId: string) => {
      const { error } = await supabase
        .from('generated_documents')
        .delete()
        .eq('id', docId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generated-documents'] });
      toast.success('Dokument gelöscht');
    },
    onError: () => {
      toast.error('Fehler beim Löschen');
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopHeader showSearch={false} />
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/meine-formulare' }} replace />;
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd. MMMM yyyy', { locale: de });
  };

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader showSearch={false} />

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Meine Formulare</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="purchased" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Gekauft</span>
              {purchases && purchases.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {purchases.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              <FileEdit className="h-4 w-4" />
              <span className="hidden sm:inline">Entwürfe</span>
              {drafts && drafts.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {drafts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="created" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Erstellt</span>
              {documents && documents.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {documents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Purchased Tab */}
          <TabsContent value="purchased">
            {isLoadingPurchases ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : purchases && purchases.length > 0 ? (
              <div className="grid gap-4">
                {purchases.map((purchase) => {
                  const form = purchase.form_templates as unknown as { 
                    slug: string; 
                    name: string; 
                    tier: string;
                  } | null;
                  const bundle = purchase.bundles as unknown as { 
                    slug: string; 
                    name: string;
                  } | null;

                  return (
                    <Card key={purchase.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {bundle ? (
                              <Package className="h-6 w-6 text-primary" />
                            ) : (
                              <FileText className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {bundle?.name || form?.name || 'Unbekanntes Formular'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Gekauft am {formatDate(purchase.purchased_at || '')}</span>
                              {form?.tier && (
                                <Badge variant="outline" className="text-xs">
                                  {FORM_TIERS[form.tier as keyof typeof FORM_TIERS]?.label}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={bundle ? `/bundles/${bundle.slug}` : `/formulare/${form?.slug}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Öffnen
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold mb-2">Noch keine Käufe</h2>
                <p className="text-muted-foreground mb-6">
                  Stöbern Sie in unseren Formularen und Bundles.
                </p>
                <Button asChild>
                  <Link to="/">Formulare entdecken</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts">
            {isLoadingDrafts ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : drafts && drafts.length > 0 ? (
              <div className="grid gap-4">
                {drafts.map((draft) => {
                  const form = draft.form_templates as unknown as { 
                    slug: string; 
                    name: string;
                  } | null;

                  return (
                    <Card key={draft.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <FileEdit className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {form?.name || 'Unbekanntes Formular'}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Schritt {draft.current_step}</span>
                              <span>•</span>
                              <span>Zuletzt bearbeitet: {formatDate(draft.updated_at || '')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/formulare/${form?.slug}`}>
                              Fortsetzen
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Entwurf löschen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Dieser Entwurf wird unwiderruflich gelöscht.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteDraftMutation.mutate(draft.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Löschen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileEdit className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold mb-2">Keine Entwürfe</h2>
                <p className="text-muted-foreground mb-6">
                  Starten Sie ein Formular und speichern Sie Ihren Fortschritt.
                </p>
                <Button asChild>
                  <Link to="/">Formular starten</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Created Tab */}
          <TabsContent value="created">
            {isLoadingDocuments ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : documents && documents.length > 0 ? (
              <div className="grid gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-success/10 rounded-lg">
                          <FileCheck className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Erstellt am {formatDate(doc.created_at || '')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.pdf_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dokument löschen?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Dieses Dokument wird unwiderruflich gelöscht.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDocumentMutation.mutate(doc.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Löschen
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold mb-2">Keine erstellten Dokumente</h2>
                <p className="text-muted-foreground mb-6">
                  Füllen Sie ein Formular aus, um ein Dokument zu erstellen.
                </p>
                <Button asChild>
                  <Link to="/">Formular ausfüllen</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinTuttO. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
