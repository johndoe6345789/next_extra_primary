import type { DragEvent } from 'react';
import type { NodeType } from './types';

/** Props for the NodePalette component. */
export interface NodePaletteProps {
  nodeSearch: string;
  onSearchChange: (value: string) => void;
  expandedCategories: Record<string, boolean>;
  onToggleCategory: (category: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onDragStart: (
    e: DragEvent, nodeType: NodeType,
  ) => void;
  nodeTypes?: NodeType[];
  categories?: Record<
    string,
    { id: string; name: string; color: string }
  >;
  languages?: string[];
  languageHealth?: Record<string, boolean>;
  selectedLanguage?: string | null;
  onLanguageChange?: (
    lang: string | null,
  ) => void;
  isLoading?: boolean;
}
