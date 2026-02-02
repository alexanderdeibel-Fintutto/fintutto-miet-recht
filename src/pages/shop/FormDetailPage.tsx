import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { FormWizard } from '@/components/shop/FormWizard';
import { FormPreview } from '@/components/shop/FormPreview';
import { PriceModal } from '@/components/shop/PriceModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  FileText, 
  Lock, 
  CheckCircle2,
  Download,
  Loader2
} from 'lucide-react';
import { useFormTemplate } from '@/hooks/useFormTemplates';
import { useFormAccess } from '@/hooks/useFormAccess';
import { useBundles } from '@/hooks/useBundles';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, FORM_TIERS, FORM_CATEGORIES } from '@/lib/formConstants';
import { toast } from 'sonner';

export default function FormDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check for success parameter (after payment)
  const paymentSuccess = searchParams.get('success') === 'true';

  // Fetch template data
  const { data: template, isLoading: isLoadingTemplate } = useFormTemplate(slug || '');
  
  // Check access
  const { data: accessInfo, isLoading: isLoadingAccess } = useFormAccess(template?.id);
  
  // Fetch bundles for upsell
  const { data: bundles } = useBundles();

  // Find a relevant bundle that contains this form
  const suggestedBundle = bundles?.find(bundle => 
    bundle.forms.some(f => {
      const formData = f.form_templates as unknown as { id: string } | null;
      return formData?.id === template?.id;
    })
  );

  // Show success toast after payment
  useEffect(() => {
    if (paymentSuccess) {
      toast.success('Kauf erfolgreich! Sie können das Formular jetzt nutzen.');
    }
  }, [paymentSuccess]);

  const hasAccess = accessInfo?.hasAccess || false;
  const tier = (template?.tier || 'free') as keyof typeof FORM_TIERS;
  const tierConfig = FORM_TIERS[tier];
  const category = (template?.category || 'sonstige') as keyof typeof FORM_CATEGORIES;
  const categoryConfig = FORM_CATEGORIES[category];

  const handleFormComplete = async (data: Record<string, unknown>) => {
    setFormData(data);
    
    if (!hasAccess && template?.price_cents && template.price_cents > 0) {
      // Show price modal for paid forms
      setIsPriceModalOpen(true);
      return;
    }

    // User has access - generate document
    await generateDocument(data);
  };

  const generateDocument = async (data: Record<string, unknown>) => {
    if (!user) {
      toast.error('Bitte melden Sie sich an, um das Dokument zu erstellen.');
      return;
    }

    setIsGenerating(true);
    try {
      // For now, just show success - PDF generation would be a separate edge function
      toast.success('Formular erfolgreich ausgefüllt! PDF-Download wird vorbereitet...');
      
      // TODO: Call edge function to generate PDF
      // const { data: pdfData } = await supabase.functions.invoke('generate-pdf', {
      //   body: { templateId: template.id, formData: data }
      // });
      
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Fehler beim Erstellen des Dokuments');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-background">
        <ShopHeader showSearch={false} />
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <ShopHeader showSearch={false} />
        <div className="container py-16 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h1 className="text-2xl font-bold mb-2">Formular nicht gefunden</h1>
          <p className="text-muted-foreground mb-6">
            Das gesuchte Formular existiert nicht oder ist nicht mehr verfügbar.
          </p>
          <Button asChild>
            <Link to="/">Zurück zur Übersicht</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader showSearch={false} />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container py-3">
          <Button variant="ghost" size="sm" asChild className="-ml-3">
            <Link to={`/${template.persona === 'mieter' ? 'mieter' : 'vermieter'}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{categoryConfig?.label || template.category}</span>
            <span>•</span>
            <Badge className={tierConfig?.color}>{tierConfig?.label}</Badge>
            {hasAccess && (
              <Badge variant="outline" className="text-success border-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Zugriff
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
          {template.description && (
            <p className="text-muted-foreground">{template.description}</p>
          )}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form Wizard */}
          <div>
            <FormWizard
              templateId={template.id}
              fields={template.fields}
              onComplete={handleFormComplete}
              onStepChange={() => {}}
            />
          </div>

          {/* Right: Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FormPreview
                template={template}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            {hasAccess ? (
              <span className="flex items-center text-success font-medium">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Zugriff vorhanden
              </span>
            ) : (
              <>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(template.price_cents)}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  Einmalzahlung
                </span>
              </>
            )}
          </div>
          <Button 
            size="lg" 
            onClick={() => {
              if (hasAccess) {
                generateDocument(formData);
              } else {
                setIsPriceModalOpen(true);
              }
            }}
            disabled={isGenerating || isLoadingAccess}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : hasAccess ? (
              <Download className="h-4 w-4 mr-2" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            {hasAccess ? 'Herunterladen' : 'Jetzt kaufen'}
          </Button>
        </div>
      </div>

      {/* Price Modal */}
      <PriceModal
        open={isPriceModalOpen}
        onOpenChange={setIsPriceModalOpen}
        template={template}
        suggestedBundle={suggestedBundle}
      />
    </div>
  );
}
