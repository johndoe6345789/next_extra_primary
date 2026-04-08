/**
 * Documentation Type System
 * JSON-backed in-app help and documentation
 */

export type {
  DocContentType,
  DocCategory,
  DocContentBlock,
  DocPage,
  DocSection,
  DocumentationIndex,
  SearchIndexEntry,
} from './documentationContent';

import type { DocCategory } from './documentationContent';

/**
 * Context-specific help topics triggered from UI
 */
export interface ContextualHelp {
  id: string;
  targetElement: string;
  title: string;
  shortTip: string;
  fullDocPageId?: string;
  keyboard?: string;
}

/**
 * Help modal state
 */
export interface HelpState {
  isOpen: boolean;
  currentPageId: string | null;
  currentCategory: DocCategory | null;
  searchQuery: string;
  searchResults: string[];
  history: string[];
}

/**
 * Keyboard shortcut documentation
 */
export interface KeyboardShortcutDoc {
  keys: string[];
  description: string;
  category:
    | 'navigation'
    | 'editing'
    | 'canvas'
    | 'general';
  platforms?: ('windows' | 'mac' | 'linux')[];
  context?: string;
}
