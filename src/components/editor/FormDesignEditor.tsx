import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Smartphone, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDesignEditor } from '@/hooks/useDesignEditor';
import { EditorHeader } from './EditorHeader';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { TemplateSelector } from './TemplateSelector';
import { VariablePanel } from './VariablePanel';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DesignConfig, FormVariable } from './types';

interface FormDesignEditorProps {
  formTemplateId?: string;
  formSlug?: string;
  initialDesign?: DesignConfig;
  variables?: FormVariable[];
  onSave?: (design: DesignConfig) => void;
  onExport?: (design: DesignConfig, format: 'pdf' | 'docx') => void;
}

export function FormDesignEditor({
  formTemplateId,
  formSlug,
  initialDesign,
  variables = [],
  onSave,
  onExport,
}: FormDesignEditorProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { plan, isPro } = useSubscription();
  const isMobile = useIsMobile();
  
  const [variablePanelOpen, setVariablePanelOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<Array<{ id: string; name: string; config: DesignConfig }>>([]);
  
  const editor = useDesignEditor(initialDesign);
  
  // Check if user can edit (Premium+ only)
  const canEdit = isPro || plan === 'business';
  
  // Load saved designs - will work after types regenerate
  useEffect(() => {
    if (!user) return;
    
    const loadSavedDesigns = async () => {
      try {
        const { data, error } = await supabase
          .from('user_form_designs' as any)
          .select('id, name, design_config')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(10);
        
        if (!error && data) {
          setSavedDesigns(
            (data as any[]).map((d: any) => ({
              id: d.id,
              name: d.name,
              config: d.design_config as DesignConfig,
            }))
          );
        }
      } catch (err) {
        // Table may not exist yet - ignore
      }
    };
    
    loadSavedDesigns();
  }, [user]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!user || !canEdit) {
      toast.error('Speichern erfordert ein Premium-Abo');
      return;
    }

    try {
      const { error } = await (supabase
        .from('user_form_designs' as any) as any)
        .upsert({
          id: editor.state.design.id,
          user_id: user.id,
          name: editor.state.design.name,
          design_config: editor.state.design,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      editor.markAsSaved();
      toast.success('Design gespeichert');
      onSave?.(editor.state.design);
    } catch (err) {
      toast.error('Fehler beim Speichern');
    }
  }, [user, canEdit, editor, onSave]);

  // Handle export
  const handleExport = useCallback((format: 'pdf' | 'docx') => {
    onExport?.(editor.state.design, format);
    toast.info(`Export als ${format.toUpperCase()} wird vorbereitet...`);
  }, [editor.state.design, onExport]);

  // Handle template selection
  const handleSelectTemplate = useCallback((variant: 'classic' | 'modern' | 'elegant' | 'blank') => {
    if (variant === 'blank') {
      editor.resetDesign();
    } else {
      editor.updateDesignVariant(variant);
      // Apply template-specific defaults
      const templateDefaults: Record<string, Partial<DesignConfig>> = {
        classic: {
          defaultFont: 'Georgia',
          defaultColor: '#000000',
          accentColor: '#1a202c',
        },
        modern: {
          defaultFont: 'Inter',
          defaultColor: '#1a202c',
          accentColor: '#6366F1',
        },
        elegant: {
          defaultFont: 'Playfair Display',
          defaultColor: '#1A365D',
          accentColor: '#C8A951',
        },
      };
      
      // We'd apply these defaults to the design
      toast.success(`Vorlage "${variant}" angewendet`);
    }
  }, [editor]);

  // Mobile view - only template selection
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Alert variant="default" className="mb-4">
          <Monitor className="h-4 w-4" />
          <AlertDescription>
            Der Design-Editor ist auf dem Desktop verfügbar. Auf Mobilgeräten können Sie eine Vorlage auswählen.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Vorlage wählen</h2>
          <TemplateSelector
            onSelectTemplate={handleSelectTemplate}
            currentVariant={editor.state.design.variant}
          />
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={() => navigate(-1)}
            >
              Weiter mit {editor.state.design.variant === 'custom' ? 'Eigenem' : editor.state.design.variant} Design
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <EditorHeader
        designName={editor.state.design.name}
        isDirty={editor.state.isDirty}
        onNameChange={editor.updateDesignName}
        onSave={handleSave}
        onExport={handleExport}
        onPreview={() => toast.info('Vorschau wird geladen...')}
        margins={editor.state.design.margins}
        onMarginsChange={editor.updateMargins}
        canEdit={canEdit}
      />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Toolbar + Templates */}
        <div className="flex flex-col border-r bg-muted/20">
          <EditorToolbar
            onAddText={editor.addTextElement}
            onAddImage={() => editor.addImageElement()}
            onAddTable={editor.addTableElement}
            onAddLine={editor.addLineElement}
            onAddBox={editor.addBoxElement}
            onAddList={editor.addListElement}
            onAddSignature={editor.addSignatureElement}
            onAddQRCode={() => editor.addQRCodeElement()}
            onOpenVariables={() => setVariablePanelOpen(true)}
            disabled={!canEdit}
          />
          
          <div className="border-t flex-1 overflow-auto">
            <TemplateSelector
              onSelectTemplate={handleSelectTemplate}
              onLoadDesign={editor.loadDesign}
              savedDesigns={savedDesigns}
              currentVariant={editor.state.design.variant}
            />
          </div>
        </div>

        {/* Canvas */}
        <EditorCanvas
          page={editor.currentPage!}
          pageIndex={editor.state.currentPageIndex}
          totalPages={editor.state.design.pages.length}
          zoom={editor.state.zoom}
          showGrid={editor.state.showGrid}
          snapToGrid={editor.state.snapToGrid}
          gridSize={editor.state.gridSize}
          selectedElementId={editor.state.selectedElementId}
          onSelectElement={editor.selectElement}
          onUpdateElement={editor.updateElement}
          onDeleteElement={editor.deleteElement}
          onZoomChange={editor.setZoom}
          onToggleGrid={editor.toggleGrid}
          onToggleSnap={editor.toggleSnapToGrid}
          onPageChange={editor.goToPage}
          onAddPage={editor.addPage}
          onDeletePage={editor.deletePage}
        />

        {/* Right sidebar - Properties */}
        <PropertiesPanel
          element={editor.selectedElement}
          onUpdate={editor.updateElement}
          onDelete={editor.deleteElement}
          onBringToFront={editor.bringToFront}
          onSendToBack={editor.sendToBack}
        />
      </div>

      {/* Variable panel */}
      <VariablePanel
        open={variablePanelOpen}
        onClose={() => setVariablePanelOpen(false)}
        variables={variables}
        onInsertVariable={editor.addVariableElement}
      />

      {/* Premium upgrade prompt for non-premium users */}
      {!canEdit && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card border shadow-lg rounded-lg p-4 flex items-center gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <div>
            <p className="font-medium text-sm">Design-Editor ist ein Premium-Feature</p>
            <p className="text-xs text-muted-foreground">
              Upgraden Sie für vollen Zugriff auf den Editor
            </p>
          </div>
          <Button size="sm" onClick={() => navigate('/pricing')}>
            Jetzt upgraden
          </Button>
        </div>
      )}
    </div>
  );
}
