import { useState, useCallback, useMemo } from 'react';
import type {
  EditorState,
  DesignConfig,
  CanvasElement,
  PageConfig,
  TextElement,
  ImageElement,
  TableElement,
  LineElement,
  BoxElement,
  ListElement,
  SignatureElement,
  QRCodeElement,
  VariableElement,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
} from '@/components/editor/types';

const generateId = () => Math.random().toString(36).substring(2, 11);

const createDefaultDesign = (): DesignConfig => ({
  id: generateId(),
  name: 'Neues Design',
  variant: 'modern',
  pages: [{
    id: generateId(),
    elements: [],
    backgroundColor: '#ffffff',
  }],
  header: {
    enabled: false,
    height: 20,
    elements: [],
    showPageNumber: false,
    showDate: false,
    showDocumentName: false,
    logoPosition: 'none',
  },
  footer: {
    enabled: false,
    height: 15,
    elements: [],
    showPageNumber: true,
    showDate: false,
    showDocumentName: false,
    logoPosition: 'none',
  },
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  defaultFont: 'Inter',
  defaultFontSize: 11,
  defaultColor: '#1a202c',
  accentColor: '#6366F1',
});

export function useDesignEditor(initialDesign?: DesignConfig) {
  const [state, setState] = useState<EditorState>({
    design: initialDesign || createDefaultDesign(),
    selectedElementId: null,
    currentPageIndex: 0,
    zoom: 100,
    showGrid: true,
    snapToGrid: true,
    gridSize: 5, // 5mm grid
    editingHeaderFooter: null,
    isDirty: false,
  });

  const currentPage = useMemo(() => 
    state.design.pages[state.currentPageIndex],
    [state.design.pages, state.currentPageIndex]
  );

  const selectedElement = useMemo(() => {
    if (!state.selectedElementId) return null;
    return currentPage?.elements.find(el => el.id === state.selectedElementId) || null;
  }, [currentPage, state.selectedElementId]);

  // Selection
  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  // Add elements
  const addTextElement = useCallback((style: 'headline' | 'body' | 'caption' = 'body') => {
    const fontSizes = { headline: 18, body: 11, caption: 9 };
    const fontWeights = { headline: 'bold', body: 'normal', caption: 'normal' } as const;
    
    const newElement: TextElement = {
      type: 'text',
      id: generateId(),
      content: style === 'headline' ? 'Überschrift' : style === 'caption' ? 'Bildunterschrift' : 'Text eingeben...',
      style,
      fontFamily: state.design.defaultFont,
      fontSize: fontSizes[style],
      fontWeight: fontWeights[style],
      color: state.design.defaultColor,
      textAlign: 'left',
      position: { x: 20, y: 20, width: 170, height: 10 },
      lineHeight: 1.5,
    };

    addElement(newElement);
    return newElement.id;
  }, [state.design]);

  const addImageElement = useCallback((src: string = '') => {
    const newElement: ImageElement = {
      type: 'image',
      id: generateId(),
      src,
      alt: 'Bild',
      position: { x: 20, y: 20, width: 50, height: 50 },
      objectFit: 'contain',
      borderRadius: 0,
    };
    addElement(newElement);
    return newElement.id;
  }, []);

  const addTableElement = useCallback((rows: number = 3, columns: number = 3) => {
    const newElement: TableElement = {
      type: 'table',
      id: generateId(),
      rows,
      columns,
      data: Array(rows).fill(null).map(() => Array(columns).fill('')),
      headerRow: true,
      position: { x: 20, y: 20, width: 170, height: rows * 8 },
      borderColor: '#e2e8f0',
      borderWidth: 1,
      cellPadding: 4,
    };
    addElement(newElement);
    return newElement.id;
  }, []);

  const addLineElement = useCallback(() => {
    const newElement: LineElement = {
      type: 'line',
      id: generateId(),
      position: { x: 20, y: 20, width: 170, height: 0 },
      color: '#e2e8f0',
      thickness: 1,
      style: 'solid',
    };
    addElement(newElement);
    return newElement.id;
  }, []);

  const addBoxElement = useCallback(() => {
    const newElement: BoxElement = {
      type: 'box',
      id: generateId(),
      position: { x: 20, y: 20, width: 50, height: 30 },
      backgroundColor: '#f7fafc',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 4,
      opacity: 1,
    };
    addElement(newElement);
    return newElement.id;
  }, []);

  const addListElement = useCallback((listStyle: 'numbered' | 'bullet' = 'bullet') => {
    const newElement: ListElement = {
      type: 'list',
      id: generateId(),
      items: ['Punkt 1', 'Punkt 2', 'Punkt 3'],
      listStyle,
      position: { x: 20, y: 20, width: 170, height: 30 },
      fontFamily: state.design.defaultFont,
      fontSize: state.design.defaultFontSize,
      color: state.design.defaultColor,
    };
    addElement(newElement);
    return newElement.id;
  }, [state.design]);

  const addSignatureElement = useCallback(() => {
    const newElement: SignatureElement = {
      type: 'signature',
      id: generateId(),
      label: 'Unterschrift',
      position: { x: 20, y: 20, width: 60, height: 20 },
      showDate: true,
      showLine: true,
    };
    addElement(newElement);
    return newElement.id;
  }, []);

  const addQRCodeElement = useCallback((content: string = 'https://fintutto.de') => {
    const newElement: QRCodeElement = {
      type: 'qrcode',
      id: generateId(),
      content,
      position: { x: 20, y: 20, width: 25, height: 25 },
      size: 25,
      color: '#000000',
      backgroundColor: '#ffffff',
    };
    addElement(newElement);
    return newElement.id;
  }, []);

  const addVariableElement = useCallback((variableKey: string, variableLabel: string) => {
    const newElement: VariableElement = {
      type: 'variable',
      id: generateId(),
      variableKey,
      variableLabel,
      position: { x: 20, y: 20, width: 40, height: 6 },
      fontFamily: state.design.defaultFont,
      fontSize: state.design.defaultFontSize,
      fontWeight: 'normal',
      color: state.design.defaultColor,
    };
    addElement(newElement);
    return newElement.id;
  }, [state.design]);

  const addElement = useCallback((element: CanvasElement) => {
    setState(prev => {
      const newPages = [...prev.design.pages];
      newPages[prev.currentPageIndex] = {
        ...newPages[prev.currentPageIndex],
        elements: [...newPages[prev.currentPageIndex].elements, element],
      };
      return {
        ...prev,
        design: { ...prev.design, pages: newPages },
        selectedElementId: element.id,
        isDirty: true,
      };
    });
  }, []);

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setState(prev => {
      const newPages = [...prev.design.pages];
      const pageIndex = prev.currentPageIndex;
      const elementIndex = newPages[pageIndex].elements.findIndex(el => el.id === id);
      
      if (elementIndex === -1) return prev;

      const oldElement = newPages[pageIndex].elements[elementIndex];
      newPages[pageIndex] = {
        ...newPages[pageIndex],
        elements: [
          ...newPages[pageIndex].elements.slice(0, elementIndex),
          { ...oldElement, ...updates } as CanvasElement,
          ...newPages[pageIndex].elements.slice(elementIndex + 1),
        ],
      };

      return {
        ...prev,
        design: { ...prev.design, pages: newPages },
        isDirty: true,
      };
    });
  }, []);

  // Delete element
  const deleteElement = useCallback((id: string) => {
    setState(prev => {
      const newPages = [...prev.design.pages];
      newPages[prev.currentPageIndex] = {
        ...newPages[prev.currentPageIndex],
        elements: newPages[prev.currentPageIndex].elements.filter(el => el.id !== id),
      };
      return {
        ...prev,
        design: { ...prev.design, pages: newPages },
        selectedElementId: prev.selectedElementId === id ? null : prev.selectedElementId,
        isDirty: true,
      };
    });
  }, []);

  // Element ordering
  const bringToFront = useCallback((id: string) => {
    setState(prev => {
      const newPages = [...prev.design.pages];
      const elements = [...newPages[prev.currentPageIndex].elements];
      const index = elements.findIndex(el => el.id === id);
      if (index === -1 || index === elements.length - 1) return prev;
      
      const [element] = elements.splice(index, 1);
      elements.push(element);
      
      newPages[prev.currentPageIndex] = { ...newPages[prev.currentPageIndex], elements };
      return { ...prev, design: { ...prev.design, pages: newPages }, isDirty: true };
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setState(prev => {
      const newPages = [...prev.design.pages];
      const elements = [...newPages[prev.currentPageIndex].elements];
      const index = elements.findIndex(el => el.id === id);
      if (index === -1 || index === 0) return prev;
      
      const [element] = elements.splice(index, 1);
      elements.unshift(element);
      
      newPages[prev.currentPageIndex] = { ...newPages[prev.currentPageIndex], elements };
      return { ...prev, design: { ...prev.design, pages: newPages }, isDirty: true };
    });
  }, []);

  // Page management
  const addPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      design: {
        ...prev.design,
        pages: [...prev.design.pages, {
          id: generateId(),
          elements: [],
          backgroundColor: '#ffffff',
        }],
      },
      currentPageIndex: prev.design.pages.length,
      isDirty: true,
    }));
  }, []);

  const deletePage = useCallback((pageIndex: number) => {
    if (state.design.pages.length <= 1) return;
    setState(prev => ({
      ...prev,
      design: {
        ...prev.design,
        pages: prev.design.pages.filter((_, i) => i !== pageIndex),
      },
      currentPageIndex: Math.min(prev.currentPageIndex, prev.design.pages.length - 2),
      isDirty: true,
    }));
  }, [state.design.pages.length]);

  const goToPage = useCallback((pageIndex: number) => {
    setState(prev => ({
      ...prev,
      currentPageIndex: Math.max(0, Math.min(pageIndex, prev.design.pages.length - 1)),
      selectedElementId: null,
    }));
  }, []);

  // Zoom
  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(25, Math.min(200, zoom)) }));
  }, []);

  // Grid
  const toggleGrid = useCallback(() => {
    setState(prev => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  // Header/Footer editing
  const editHeaderFooter = useCallback((section: 'header' | 'footer' | null) => {
    setState(prev => ({ ...prev, editingHeaderFooter: section }));
  }, []);

  // Update design metadata
  const updateDesignName = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      design: { ...prev.design, name },
      isDirty: true,
    }));
  }, []);

  const updateDesignVariant = useCallback((variant: 'classic' | 'modern' | 'elegant' | 'custom') => {
    setState(prev => ({
      ...prev,
      design: { ...prev.design, variant },
      isDirty: true,
    }));
  }, []);

  const updateMargins = useCallback((margins: Partial<DesignConfig['margins']>) => {
    setState(prev => ({
      ...prev,
      design: { ...prev.design, margins: { ...prev.design.margins, ...margins } },
      isDirty: true,
    }));
  }, []);

  // Load/Reset design
  const loadDesign = useCallback((design: DesignConfig) => {
    setState(prev => ({
      ...prev,
      design,
      selectedElementId: null,
      currentPageIndex: 0,
      isDirty: false,
    }));
  }, []);

  const resetDesign = useCallback(() => {
    setState(prev => ({
      ...prev,
      design: createDefaultDesign(),
      selectedElementId: null,
      currentPageIndex: 0,
      isDirty: false,
    }));
  }, []);

  const markAsSaved = useCallback(() => {
    setState(prev => ({ ...prev, isDirty: false }));
  }, []);

  return {
    state,
    currentPage,
    selectedElement,
    
    // Selection
    selectElement,
    
    // Add elements
    addTextElement,
    addImageElement,
    addTableElement,
    addLineElement,
    addBoxElement,
    addListElement,
    addSignatureElement,
    addQRCodeElement,
    addVariableElement,
    
    // Element manipulation
    updateElement,
    deleteElement,
    bringToFront,
    sendToBack,
    
    // Page management
    addPage,
    deletePage,
    goToPage,
    
    // View controls
    setZoom,
    toggleGrid,
    toggleSnapToGrid,
    editHeaderFooter,
    
    // Design metadata
    updateDesignName,
    updateDesignVariant,
    updateMargins,
    
    // Load/Save
    loadDesign,
    resetDesign,
    markAsSaved,
  };
}
