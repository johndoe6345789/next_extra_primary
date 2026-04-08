/**
 * useEditorHistory Hook
 * Manages undo/redo for editor state changes
 */

import { useCallback, useState } from 'react';
import type {
  HistoryState, UseEditorHistoryReturn,
} from './editorHistoryTypes';
import { emptyHistory } from
  './editorHistoryTypes';

export type {
  HistoryState, UseEditorHistoryReturn,
} from './editorHistoryTypes';

/** Editor undo/redo hook */
export function useEditorHistory(
): UseEditorHistoryReturn {
  const [history, setHistory] =
    useState<HistoryState>(emptyHistory);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    setHistory((prev) => ({
      past: prev.past.slice(0, -1),
      present: prev.past[
        prev.past.length - 1
      ],
      future: [
        prev.present, ...prev.future,
      ],
    }));
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: prev.future[0],
      future: prev.future.slice(1),
    }));
  }, [canRedo]);

  const pushState = useCallback(
    (state: unknown) => {
      setHistory((prev) => ({
        past: [...prev.past, prev.present],
        present: state,
        future: [],
      }));
    }, []);

  const clearHistory = useCallback(() => {
    setHistory(emptyHistory);
  }, []);

  return {
    canUndo, canRedo,
    undo, redo, clearHistory, pushState,
  };
}

export default useEditorHistory;
