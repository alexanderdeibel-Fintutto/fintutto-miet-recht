import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Grid3X3, 
  Magnet,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { 
  PageConfig, 
  CanvasElement, 
  Position,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  mmToPx,
  pxToMm,
} from './types';

// A4 dimensions
const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm
const MM_TO_PX = 3.7795275591;

interface EditorCanvasProps {
  page: PageConfig;
  pageIndex: number;
  totalPages: number;
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onZoomChange: (zoom: number) => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
}

export function EditorCanvas({
  page,
  pageIndex,
  totalPages,
  zoom,
  showGrid,
  snapToGrid,
  gridSize,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onZoomChange,
  onToggleGrid,
  onToggleSnap,
  onPageChange,
  onAddPage,
  onDeletePage,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<{ id: string; handle: string } | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState<Position>({ x: 0, y: 0, width: 0, height: 0 });

  const scale = zoom / 100;
  const canvasWidth = A4_WIDTH * MM_TO_PX * scale;
  const canvasHeight = A4_HEIGHT * MM_TO_PX * scale;

  const snapValue = (value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onSelectElement(elementId);
    
    const element = page.elements.find(el => el.id === elementId);
    if (!element) return;

    setDragging(elementId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart(element.position);
  }, [page.elements, onSelectElement]);

  const handleResizeStart = useCallback((e: React.MouseEvent, elementId: string, handle: string) => {
    e.stopPropagation();
    
    const element = page.elements.find(el => el.id === elementId);
    if (!element) return;

    setResizing({ id: elementId, handle });
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart(element.position);
  }, [page.elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const dx = (e.clientX - dragStart.x) / scale / MM_TO_PX;
      const dy = (e.clientY - dragStart.y) / scale / MM_TO_PX;
      
      const newX = snapValue(elementStart.x + dx);
      const newY = snapValue(elementStart.y + dy);
      
      onUpdateElement(dragging, {
        position: {
          ...elementStart,
          x: Math.max(0, Math.min(A4_WIDTH - elementStart.width, newX)),
          y: Math.max(0, Math.min(A4_HEIGHT - elementStart.height, newY)),
        },
      });
    } else if (resizing) {
      const dx = (e.clientX - dragStart.x) / scale / MM_TO_PX;
      const dy = (e.clientY - dragStart.y) / scale / MM_TO_PX;
      
      let newPosition = { ...elementStart };
      
      if (resizing.handle.includes('e')) {
        newPosition.width = snapValue(Math.max(10, elementStart.width + dx));
      }
      if (resizing.handle.includes('w')) {
        const newWidth = snapValue(Math.max(10, elementStart.width - dx));
        newPosition.x = elementStart.x + (elementStart.width - newWidth);
        newPosition.width = newWidth;
      }
      if (resizing.handle.includes('s')) {
        newPosition.height = snapValue(Math.max(5, elementStart.height + dy));
      }
      if (resizing.handle.includes('n')) {
        const newHeight = snapValue(Math.max(5, elementStart.height - dy));
        newPosition.y = elementStart.y + (elementStart.height - newHeight);
        newPosition.height = newHeight;
      }
      
      onUpdateElement(resizing.id, { position: newPosition });
    }
  }, [dragging, resizing, dragStart, elementStart, scale, snapValue, onUpdateElement]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setResizing(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      onSelectElement(null);
    }
  }, [onSelectElement]);

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElementId === element.id;
    const pos = element.position;
    
    const style: React.CSSProperties = {
      position: 'absolute',
      left: pos.x * MM_TO_PX * scale,
      top: pos.y * MM_TO_PX * scale,
      width: pos.width * MM_TO_PX * scale,
      height: pos.height * MM_TO_PX * scale,
      cursor: dragging === element.id ? 'grabbing' : 'grab',
    };

    const renderContent = () => {
      switch (element.type) {
        case 'text':
          return (
            <div
              style={{
                fontFamily: element.fontFamily,
                fontSize: element.fontSize * scale,
                fontWeight: element.fontWeight,
                color: element.color,
                textAlign: element.textAlign,
                lineHeight: element.lineHeight,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              {element.content}
            </div>
          );
        
        case 'image':
          return element.src ? (
            <img
              src={element.src}
              alt={element.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.objectFit,
                borderRadius: element.borderRadius * scale,
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
              Bild
            </div>
          );
        
        case 'table':
          return (
            <table
              style={{
                width: '100%',
                height: '100%',
                borderCollapse: 'collapse',
                fontSize: 10 * scale,
              }}
            >
              <tbody>
                {element.data.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        style={{
                          border: `${element.borderWidth}px solid ${element.borderColor}`,
                          padding: element.cellPadding * scale,
                          fontWeight: element.headerRow && rowIdx === 0 ? 'bold' : 'normal',
                          backgroundColor: element.headerRow && rowIdx === 0 ? '#f7fafc' : 'transparent',
                        }}
                      >
                        {cell || '\u00A0'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        
        case 'line':
          return (
            <div
              style={{
                width: '100%',
                borderTop: `${element.thickness}px ${element.style} ${element.color}`,
                position: 'absolute',
                top: '50%',
              }}
            />
          );
        
        case 'box':
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: element.backgroundColor,
                border: `${element.borderWidth}px ${element.borderStyle} ${element.borderColor}`,
                borderRadius: element.borderRadius * scale,
                opacity: element.opacity,
              }}
            />
          );
        
        case 'list':
          const ListTag = element.listStyle === 'numbered' ? 'ol' : 'ul';
          return (
            <ListTag
              style={{
                fontFamily: element.fontFamily,
                fontSize: element.fontSize * scale,
                color: element.color,
                margin: 0,
                paddingLeft: 20 * scale,
              }}
            >
              {element.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ListTag>
          );
        
        case 'signature':
          return (
            <div className="flex flex-col justify-end h-full" style={{ fontSize: 10 * scale }}>
              {element.showLine && (
                <div className="border-b border-foreground mb-1" />
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{element.label}</span>
                {element.showDate && <span>Datum: __________</span>}
              </div>
            </div>
          );
        
        case 'qrcode':
          return (
            <div
              className="flex items-center justify-center bg-white"
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <div className="text-xs text-muted-foreground text-center">
                QR<br/>Code
              </div>
            </div>
          );
        
        case 'variable':
          return (
            <div
              style={{
                fontFamily: element.fontFamily,
                fontSize: element.fontSize * scale,
                fontWeight: element.fontWeight,
                color: element.color,
                backgroundColor: '#e0e7ff',
                padding: `${2 * scale}px ${4 * scale}px`,
                borderRadius: 4 * scale,
                border: '1px dashed #6366f1',
              }}
            >
              [{element.variableLabel}]
            </div>
          );
        
        default:
          return null;
      }
    };

    return (
      <div
        key={element.id}
        style={style}
        className={cn(
          'group',
          isSelected && 'ring-2 ring-primary ring-offset-1'
        )}
        onMouseDown={(e) => handleMouseDown(e, element.id)}
      >
        {renderContent()}
        
        {/* Resize handles */}
        {isSelected && (
          <>
            {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(handle => (
              <div
                key={handle}
                className={cn(
                  'absolute w-2 h-2 bg-primary border border-white rounded-sm',
                  handle.includes('n') && 'top-0 -translate-y-1/2',
                  handle.includes('s') && 'bottom-0 translate-y-1/2',
                  handle.includes('w') && 'left-0 -translate-x-1/2',
                  handle.includes('e') && 'right-0 translate-x-1/2',
                  handle === 'n' && 'left-1/2 -translate-x-1/2',
                  handle === 's' && 'left-1/2 -translate-x-1/2',
                  handle === 'w' && 'top-1/2 -translate-y-1/2',
                  handle === 'e' && 'top-1/2 -translate-y-1/2',
                  (handle === 'nw' || handle === 'se') && 'cursor-nwse-resize',
                  (handle === 'ne' || handle === 'sw') && 'cursor-nesw-resize',
                  (handle === 'n' || handle === 's') && 'cursor-ns-resize',
                  (handle === 'w' || handle === 'e') && 'cursor-ew-resize',
                )}
                onMouseDown={(e) => handleResizeStart(e, element.id, handle)}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
      {/* Canvas toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoomChange(zoom - 25)}
            disabled={zoom <= 25}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-24">
            <Slider
              value={[zoom]}
              onValueChange={([v]) => onZoomChange(v)}
              min={25}
              max={200}
              step={25}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onZoomChange(zoom + 25)}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12">{zoom}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showGrid ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onToggleGrid}
            title="Raster ein/aus"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={snapToGrid ? 'secondary' : 'ghost'}
            size="icon"
            onClick={onToggleSnap}
            title="Am Raster ausrichten"
          >
            <Magnet className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Seite {pageIndex + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddPage}
            title="Seite hinzufügen"
            disabled={totalPages >= 20}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeletePage(pageIndex)}
            disabled={totalPages <= 1}
            title="Seite löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center p-8"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="canvas-bg relative bg-white shadow-lg"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            backgroundImage: showGrid
              ? `linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                 linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`
              : 'none',
            backgroundSize: showGrid
              ? `${gridSize * MM_TO_PX * scale}px ${gridSize * MM_TO_PX * scale}px`
              : 'auto',
          }}
        >
          {page.elements.map(renderElement)}
        </div>
      </div>
    </div>
  );
}
