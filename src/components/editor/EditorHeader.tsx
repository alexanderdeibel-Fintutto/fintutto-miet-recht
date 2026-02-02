import { useState, useCallback } from 'react';
import {
  Save,
  Download,
  Undo2,
  Redo2,
  Settings,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import type { DesignConfig } from './types';

interface EditorHeaderProps {
  designName: string;
  isDirty: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onExport: (format: 'pdf' | 'docx') => void;
  onPreview: () => void;
  margins: DesignConfig['margins'];
  onMarginsChange: (margins: Partial<DesignConfig['margins']>) => void;
  canEdit: boolean;
}

export function EditorHeader({
  designName,
  isDirty,
  onNameChange,
  onSave,
  onExport,
  onPreview,
  margins,
  onMarginsChange,
  canEdit,
}: EditorHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(designName);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNameSubmit = () => {
    onNameChange(tempName);
    setIsEditingName(false);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
      {/* Left: Name and save indicator */}
      <div className="flex items-center gap-3">
        {isEditingName ? (
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            className="h-8 w-48 text-sm"
            autoFocus
          />
        ) : (
          <button
            onClick={() => {
              setTempName(designName);
              setIsEditingName(true);
            }}
            className="text-sm font-medium hover:text-primary transition-colors"
            disabled={!canEdit}
          >
            {designName}
          </button>
        )}
        {isDirty && (
          <span className="text-xs text-muted-foreground">
            • Ungespeicherte Änderungen
          </span>
        )}
      </div>

      {/* Center: Main actions */}
      <div className="flex items-center gap-1">
        {!canEdit && (
          <div className="flex items-center gap-2 mr-4 px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">
            <Lock className="h-3 w-3" />
            Nur Lesen (Premium erforderlich)
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canEdit}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rückgängig (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canEdit}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Wiederholen (Ctrl+Y)</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onPreview}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vorschau</TooltipContent>
        </Tooltip>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dokument-Einstellungen</DialogTitle>
              <DialogDescription>
                Ränder und allgemeine Einstellungen für das Dokument.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">Oben (mm)</Label>
                  <Input
                    type="number"
                    value={margins.top}
                    onChange={(e) => onMarginsChange({ top: Number(e.target.value) })}
                    className="h-8"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label className="text-xs">Rechts (mm)</Label>
                  <Input
                    type="number"
                    value={margins.right}
                    onChange={(e) => onMarginsChange({ right: Number(e.target.value) })}
                    className="h-8"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label className="text-xs">Unten (mm)</Label>
                  <Input
                    type="number"
                    value={margins.bottom}
                    onChange={(e) => onMarginsChange({ bottom: Number(e.target.value) })}
                    className="h-8"
                    disabled={!canEdit}
                  />
                </div>
                <div>
                  <Label className="text-xs">Links (mm)</Label>
                  <Input
                    type="number"
                    value={margins.left}
                    onChange={(e) => onMarginsChange({ left: Number(e.target.value) })}
                    className="h-8"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSettingsOpen(false)}>Fertig</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right: Save and export */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={!canEdit || !isDirty}
        >
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('pdf')}>
              Als PDF herunterladen
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('docx')}>
              Als Word-Dokument (.docx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
