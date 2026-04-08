/**
 * Documentation slice helpers and types
 */

import type { DocCategory } from
  '../types/documentation';

/** Max history items */
export const MAX_HISTORY = 20;

/** Help panel state */
export interface HelpState {
  isOpen: boolean;
  currentPageId: string | null;
  currentCategory: DocCategory | null;
  searchQuery: string;
  searchResults: string[];
  history: string[];
}

/** Initial help state */
export const helpInitialState: HelpState = {
  isOpen: false,
  currentPageId: null,
  currentCategory: null,
  searchQuery: '',
  searchResults: [],
  history: [],
};

/** Add page to history if not present */
export function addToHistory(
  history: string[], pageId: string
): string[] {
  if (history.includes(pageId)) return history;
  return [pageId, ...history].slice(
    0, MAX_HISTORY
  );
}
