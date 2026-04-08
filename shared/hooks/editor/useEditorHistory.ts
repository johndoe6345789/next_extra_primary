/**
 * useEditorHistory Hook
 * Manages undo/redo for editor state changes
 */

import { useCallback, useState } from 'react';
import type {
  HistoryState,
  UseEditorHistoryReturn,
} from './editorHistoryTypes';
import { DEFAULT_HISTORY } from './editorHistoryTypes';

export type {
  HistoryState,
  UseEditorHistoryReturn,
} from './editorHistoryTypes';

/** Hook for editor undo/redo */
export function useEditorHistory(
): UseEditorHistoryReturn {
  const [history, setHistory] =
    useState<HistoryState>(DEFAULT_HISTORY);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    setHistory((prev) => ({
      past: prev.past.slice(0, -1),
      present:
        prev.past[prev.past.length - 1],
      future: [
        prev.present, ...prev.future,
      ],
    }));
  }, [history.past.length]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: prev.future[0],
      future: prev.future.slice(1),
    }));
  }, [history.future.length]);

  const pushState = useCallback(
    (state: unknown) => {
      setHistory((prev) => ({
        past: [...prev.past, prev.present],
        present: state,
        future: [],
      }));
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory(DEFAULT_HISTORY);
  }, []);

  return {
    canUndo, canRedo,
    undo, redo,
    clearHistory, pushState,
  };
}

export default useEditorHistory;
