/**
 * Editor history type definitions
 */

/** History state for undo/redo */
export interface HistoryState {
  past: unknown[];
  present: unknown;
  future: unknown[];
}

/** Return type of useEditorHistory */
export interface UseEditorHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  pushState: (state: unknown) => void;
}

/** Default empty history state */
export const DEFAULT_HISTORY: HistoryState = {
  past: [],
  present: null,
  future: [],
};
