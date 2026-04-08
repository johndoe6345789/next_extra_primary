/**
 * Editor history type definitions
 */

/** History state for undo/redo */
export interface HistoryState {
  past: unknown[];
  present: unknown;
  future: unknown[];
}

/** Return type for useEditorHistory hook */
export interface UseEditorHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  pushState: (state: unknown) => void;
}

/** Default empty history */
export const emptyHistory: HistoryState = {
  past: [],
  present: null,
  future: [],
};
