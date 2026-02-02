import { 
  Type, 
  Image, 
  Table, 
  Minus, 
  Square, 
  List, 
  ListOrdered,
  PenTool, 
  QrCode, 
  Variable,
  Heading1,
  Heading2,
  AlignLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EditorToolbarProps {
  onAddText: (style: 'headline' | 'body' | 'caption') => void;
  onAddImage: () => void;
  onAddTable: (rows: number, cols: number) => void;
  onAddLine: () => void;
  onAddBox: () => void;
  onAddList: (style: 'numbered' | 'bullet') => void;
  onAddSignature: () => void;
  onAddQRCode: () => void;
  onOpenVariables: () => void;
  disabled?: boolean;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function ToolButton({ icon, label, onClick, disabled }: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className="h-10 w-10 hover:bg-accent"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function EditorToolbar({
  onAddText,
  onAddImage,
  onAddTable,
  onAddLine,
  onAddBox,
  onAddList,
  onAddSignature,
  onAddQRCode,
  onOpenVariables,
  disabled = false,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 bg-background border-r w-14">
      <p className="text-[10px] text-muted-foreground font-medium mb-2">Elemente</p>
      
      {/* Text dropdown */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                className="h-10 w-10 hover:bg-accent"
              >
                <Type className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Text einfügen</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={() => onAddText('headline')}>
            <Heading1 className="h-4 w-4 mr-2" />
            Überschrift
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddText('body')}>
            <AlignLeft className="h-4 w-4 mr-2" />
            Fließtext
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddText('caption')}>
            <Heading2 className="h-4 w-4 mr-2" />
            Bildunterschrift
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolButton
        icon={<Image className="h-5 w-5" />}
        label="Bild/Logo einfügen"
        onClick={onAddImage}
        disabled={disabled}
      />

      {/* Table dropdown */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                className="h-10 w-10 hover:bg-accent"
              >
                <Table className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Tabelle einfügen</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={() => onAddTable(2, 2)}>
            2 × 2 Tabelle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTable(3, 3)}>
            3 × 3 Tabelle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTable(4, 4)}>
            4 × 4 Tabelle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddTable(5, 3)}>
            5 × 3 Tabelle
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="my-2 w-8" />

      <ToolButton
        icon={<Minus className="h-5 w-5" />}
        label="Trennlinie"
        onClick={onAddLine}
        disabled={disabled}
      />

      <ToolButton
        icon={<Square className="h-5 w-5" />}
        label="Box/Rahmen"
        onClick={onAddBox}
        disabled={disabled}
      />

      {/* List dropdown */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={disabled}
                className="h-10 w-10 hover:bg-accent"
              >
                <List className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Liste einfügen</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem onClick={() => onAddList('bullet')}>
            <List className="h-4 w-4 mr-2" />
            Aufzählung
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddList('numbered')}>
            <ListOrdered className="h-4 w-4 mr-2" />
            Nummeriert
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="my-2 w-8" />

      <ToolButton
        icon={<PenTool className="h-5 w-5" />}
        label="Unterschriftsfeld"
        onClick={onAddSignature}
        disabled={disabled}
      />

      <ToolButton
        icon={<QrCode className="h-5 w-5" />}
        label="QR-Code"
        onClick={onAddQRCode}
        disabled={disabled}
      />

      <Separator className="my-2 w-8" />

      <ToolButton
        icon={<Variable className="h-5 w-5" />}
        label="Variable einfügen"
        onClick={onOpenVariables}
        disabled={disabled}
      />
    </div>
  );
}
