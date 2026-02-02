// FormDesignEditor Types

export type ElementType = 
  | 'text' 
  | 'image' 
  | 'table' 
  | 'line' 
  | 'box' 
  | 'list' 
  | 'signature' 
  | 'qrcode' 
  | 'variable';

export type TextStyle = 'headline' | 'body' | 'caption';
export type ListStyle = 'numbered' | 'bullet';
export type FontWeight = 'normal' | 'bold' | 'light';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'none';

export interface Position {
  x: number;  // in mm
  y: number;  // in mm
  width: number;  // in mm
  height: number;  // in mm
}

export interface TextElement {
  type: 'text';
  id: string;
  content: string;
  style: TextStyle;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  textAlign: TextAlign;
  position: Position;
  lineHeight: number;
}

export interface ImageElement {
  type: 'image';
  id: string;
  src: string;
  alt: string;
  position: Position;
  objectFit: 'contain' | 'cover' | 'fill';
  borderRadius: number;
}

export interface TableElement {
  type: 'table';
  id: string;
  rows: number;
  columns: number;
  data: string[][];
  headerRow: boolean;
  position: Position;
  borderColor: string;
  borderWidth: number;
  cellPadding: number;
}

export interface LineElement {
  type: 'line';
  id: string;
  position: Position;
  color: string;
  thickness: number;
  style: BorderStyle;
}

export interface BoxElement {
  type: 'box';
  id: string;
  position: Position;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: BorderStyle;
  borderRadius: number;
  opacity: number;
}

export interface ListElement {
  type: 'list';
  id: string;
  items: string[];
  listStyle: ListStyle;
  position: Position;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export interface SignatureElement {
  type: 'signature';
  id: string;
  label: string;
  position: Position;
  showDate: boolean;
  showLine: boolean;
}

export interface QRCodeElement {
  type: 'qrcode';
  id: string;
  content: string;
  position: Position;
  size: number;
  color: string;
  backgroundColor: string;
}

export interface VariableElement {
  type: 'variable';
  id: string;
  variableKey: string;
  variableLabel: string;
  position: Position;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
}

export type CanvasElement = 
  | TextElement 
  | ImageElement 
  | TableElement 
  | LineElement 
  | BoxElement 
  | ListElement 
  | SignatureElement 
  | QRCodeElement 
  | VariableElement;

export interface PageConfig {
  id: string;
  elements: CanvasElement[];
  backgroundColor: string;
}

export interface HeaderFooterConfig {
  enabled: boolean;
  height: number;  // in mm
  elements: CanvasElement[];
  showPageNumber: boolean;
  showDate: boolean;
  showDocumentName: boolean;
  logoPosition: 'left' | 'center' | 'right' | 'none';
  logoSrc?: string;
}

export interface DesignConfig {
  id: string;
  name: string;
  variant: 'classic' | 'modern' | 'elegant' | 'custom';
  pages: PageConfig[];
  header: HeaderFooterConfig;
  footer: HeaderFooterConfig;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  defaultFont: string;
  defaultFontSize: number;
  defaultColor: string;
  accentColor: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  thumbnail: string;
  variant: 'classic' | 'modern' | 'elegant';
  config: DesignConfig;
}

export interface FormVariable {
  key: string;
  label: string;
  category: string;
  example: string;
}

export interface EditorState {
  design: DesignConfig;
  selectedElementId: string | null;
  currentPageIndex: number;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  editingHeaderFooter: 'header' | 'footer' | null;
  isDirty: boolean;
}

// A4 dimensions in mm
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

// Conversion helpers
export const MM_TO_PX = 3.7795275591; // 1mm = 3.78px at 96 DPI
export const PX_TO_MM = 0.2645833333; // 1px = 0.26mm at 96 DPI

export const mmToPx = (mm: number): number => mm * MM_TO_PX;
export const pxToMm = (px: number): number => px * PX_TO_MM;
