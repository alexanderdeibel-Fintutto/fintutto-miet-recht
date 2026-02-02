import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CanvasElement, TextElement, Position } from './types';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
}

const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Open Sans', label: 'Open Sans' },
];

function ColorPicker({ color, onChange, label }: { color: string; onChange: (c: string) => void; label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9"
          >
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono">{color}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexColorPicker color={color} onChange={onChange} />
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 h-8 text-xs"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function PositionInputs({ 
  position, 
  onChange 
}: { 
  position: Position; 
  onChange: (pos: Partial<Position>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-xs">X (mm)</Label>
        <Input
          type="number"
          value={Math.round(position.x)}
          onChange={(e) => onChange({ x: Number(e.target.value) })}
          className="h-8 text-xs"
        />
      </div>
      <div>
        <Label className="text-xs">Y (mm)</Label>
        <Input
          type="number"
          value={Math.round(position.y)}
          onChange={(e) => onChange({ y: Number(e.target.value) })}
          className="h-8 text-xs"
        />
      </div>
      <div>
        <Label className="text-xs">Breite (mm)</Label>
        <Input
          type="number"
          value={Math.round(position.width)}
          onChange={(e) => onChange({ width: Number(e.target.value) })}
          className="h-8 text-xs"
        />
      </div>
      <div>
        <Label className="text-xs">Höhe (mm)</Label>
        <Input
          type="number"
          value={Math.round(position.height)}
          onChange={(e) => onChange({ height: Number(e.target.value) })}
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}

export function PropertiesPanel({
  element,
  onUpdate,
  onDelete,
  onBringToFront,
  onSendToBack,
}: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="w-64 border-l bg-background p-4">
        <p className="text-sm text-muted-foreground text-center mt-8">
          Wählen Sie ein Element aus, um dessen Eigenschaften zu bearbeiten.
        </p>
      </div>
    );
  }

  const updatePosition = (pos: Partial<Position>) => {
    onUpdate(element.id, { position: { ...element.position, ...pos } });
  };

  const renderTypeSpecificProps = () => {
    switch (element.type) {
      case 'text':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Text</Label>
              <Textarea
                value={element.content}
                onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                className="text-xs min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Schriftart</Label>
              <Select
                value={element.fontFamily}
                onValueChange={(v) => onUpdate(element.id, { fontFamily: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Größe</Label>
                <Input
                  type="number"
                  value={element.fontSize}
                  onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
                  className="h-8 text-xs"
                  min={6}
                  max={72}
                />
              </div>
              <div>
                <Label className="text-xs">Zeilenhöhe</Label>
                <Input
                  type="number"
                  value={element.lineHeight}
                  onChange={(e) => onUpdate(element.id, { lineHeight: Number(e.target.value) })}
                  className="h-8 text-xs"
                  min={1}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Ausrichtung</Label>
              <div className="flex gap-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                  { value: 'justify', icon: AlignJustify },
                ].map(({ value, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={element.textAlign === value ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdate(element.id, { textAlign: value as any })}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
                <Button
                  variant={element.fontWeight === 'bold' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdate(element.id, { 
                    fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ColorPicker
              color={element.color}
              onChange={(c) => onUpdate(element.id, { color: c })}
              label="Textfarbe"
            />
          </>
        );

      case 'image':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Bild-URL</Label>
              <Input
                value={element.src}
                onChange={(e) => onUpdate(element.id, { src: e.target.value })}
                className="h-8 text-xs"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Alt-Text</Label>
              <Input
                value={element.alt}
                onChange={(e) => onUpdate(element.id, { alt: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Passform</Label>
              <Select
                value={element.objectFit}
                onValueChange={(v) => onUpdate(element.id, { objectFit: v as any })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contain">Einpassen</SelectItem>
                  <SelectItem value="cover">Ausfüllen</SelectItem>
                  <SelectItem value="fill">Strecken</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Eckenradius: {element.borderRadius}mm</Label>
              <Slider
                value={[element.borderRadius]}
                onValueChange={([v]) => onUpdate(element.id, { borderRadius: v })}
                min={0}
                max={20}
              />
            </div>
          </>
        );

      case 'box':
        return (
          <>
            <ColorPicker
              color={element.backgroundColor}
              onChange={(c) => onUpdate(element.id, { backgroundColor: c })}
              label="Hintergrund"
            />
            <ColorPicker
              color={element.borderColor}
              onChange={(c) => onUpdate(element.id, { borderColor: c })}
              label="Rahmenfarbe"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Rahmenstärke</Label>
                <Input
                  type="number"
                  value={element.borderWidth}
                  onChange={(e) => onUpdate(element.id, { borderWidth: Number(e.target.value) })}
                  className="h-8 text-xs"
                  min={0}
                  max={10}
                />
              </div>
              <div>
                <Label className="text-xs">Radius</Label>
                <Input
                  type="number"
                  value={element.borderRadius}
                  onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
                  className="h-8 text-xs"
                  min={0}
                  max={50}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Rahmenstil</Label>
              <Select
                value={element.borderStyle}
                onValueChange={(v) => onUpdate(element.id, { borderStyle: v as any })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Durchgehend</SelectItem>
                  <SelectItem value="dashed">Gestrichelt</SelectItem>
                  <SelectItem value="dotted">Gepunktet</SelectItem>
                  <SelectItem value="none">Kein Rahmen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Deckkraft: {Math.round(element.opacity * 100)}%</Label>
              <Slider
                value={[element.opacity * 100]}
                onValueChange={([v]) => onUpdate(element.id, { opacity: v / 100 })}
                min={0}
                max={100}
              />
            </div>
          </>
        );

      case 'line':
        return (
          <>
            <ColorPicker
              color={element.color}
              onChange={(c) => onUpdate(element.id, { color: c })}
              label="Linienfarbe"
            />
            <div className="space-y-2">
              <Label className="text-xs">Linienstärke: {element.thickness}px</Label>
              <Slider
                value={[element.thickness]}
                onValueChange={([v]) => onUpdate(element.id, { thickness: v })}
                min={1}
                max={10}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Linienstil</Label>
              <Select
                value={element.style}
                onValueChange={(v) => onUpdate(element.id, { style: v as any })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Durchgehend</SelectItem>
                  <SelectItem value="dashed">Gestrichelt</SelectItem>
                  <SelectItem value="dotted">Gepunktet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'list':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Listeneinträge (einer pro Zeile)</Label>
              <Textarea
                value={element.items.join('\n')}
                onChange={(e) => onUpdate(element.id, { items: e.target.value.split('\n') })}
                className="text-xs min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Listenstil</Label>
              <Select
                value={element.listStyle}
                onValueChange={(v) => onUpdate(element.id, { listStyle: v as any })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Aufzählung (•)</SelectItem>
                  <SelectItem value="numbered">Nummeriert (1.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ColorPicker
              color={element.color}
              onChange={(c) => onUpdate(element.id, { color: c })}
              label="Textfarbe"
            />
          </>
        );

      case 'signature':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Beschriftung</Label>
              <Input
                value={element.label}
                onChange={(e) => onUpdate(element.id, { label: e.target.value })}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Linie anzeigen</Label>
              <Switch
                checked={element.showLine}
                onCheckedChange={(c) => onUpdate(element.id, { showLine: c })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Datum anzeigen</Label>
              <Switch
                checked={element.showDate}
                onCheckedChange={(c) => onUpdate(element.id, { showDate: c })}
              />
            </div>
          </>
        );

      case 'qrcode':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs">QR-Code Inhalt</Label>
              <Input
                value={element.content}
                onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                className="h-8 text-xs"
                placeholder="URL oder Text"
              />
            </div>
            <ColorPicker
              color={element.color}
              onChange={(c) => onUpdate(element.id, { color: c })}
              label="Vordergrund"
            />
            <ColorPicker
              color={element.backgroundColor}
              onChange={(c) => onUpdate(element.id, { backgroundColor: c })}
              label="Hintergrund"
            />
          </>
        );

      case 'variable':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Variable</Label>
              <div className="p-2 bg-muted rounded text-xs">
                <strong>{element.variableLabel}</strong>
                <br />
                <span className="text-muted-foreground font-mono">{`{{${element.variableKey}}}`}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Schriftart</Label>
              <Select
                value={element.fontFamily}
                onValueChange={(v) => onUpdate(element.id, { fontFamily: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Schriftgröße</Label>
              <Input
                type="number"
                value={element.fontSize}
                onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
                className="h-8 text-xs"
                min={6}
                max={72}
              />
            </div>
            <ColorPicker
              color={element.color}
              onChange={(c) => onUpdate(element.id, { color: c })}
              label="Textfarbe"
            />
          </>
        );

      default:
        return null;
    }
  };

  const elementTypeLabels: Record<string, string> = {
    text: 'Text',
    image: 'Bild',
    table: 'Tabelle',
    line: 'Linie',
    box: 'Box',
    list: 'Liste',
    signature: 'Unterschrift',
    qrcode: 'QR-Code',
    variable: 'Variable',
  };

  return (
    <ScrollArea className="w-64 border-l bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">
            {elementTypeLabels[element.type] || 'Element'}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onSendToBack(element.id)}
              title="Nach hinten"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onBringToFront(element.id)}
              title="Nach vorne"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(element.id)}
              title="Löschen"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Position</p>
          <PositionInputs
            position={element.position}
            onChange={updatePosition}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Eigenschaften</p>
          {renderTypeSpecificProps()}
        </div>
      </div>
    </ScrollArea>
  );
}
