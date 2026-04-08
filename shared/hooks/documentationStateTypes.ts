/**
 * Documentation Redux state and action types
 */

import type { DocCategory } from './documentationTypes'

/** Redux state for documentation */
export interface DocumentationState {
  isOpen: boolean;
  currentPageId: string | null;
  currentCategory: DocCategory | null;
  searchQuery: string;
  searchResults: string[];
  history: string[];
}

/** Redux actions interface */
export interface DocumentationActions {
  openHelp: (payload: {
    pageId?: string;
    category?: DocCategory;
  }) => any;
  closeHelp: () => any;
  navigateToPage: (
    pageId: string
  ) => any;
  setCategory: (
    category: DocCategory | null
  ) => any;
  setSearchQuery: (
    query: string
  ) => any;
  setSearchResults: (
    results: string[]
  ) => any;
  goBack: () => any;
  clearSearch: () => any;
}

/** Options for useDocumentation hook */
export interface UseDocumentationOptions {
  /** Redux dispatch function */
  dispatch: (action: unknown) => void;
  /** Documentation state from Redux */
  helpState: DocumentationState;
  /** Documentation service instance */
  documentationService: import(
    './documentationTypes'
  ).DocumentationService;
  /** Redux action creators */
  actions: DocumentationActions;
}
