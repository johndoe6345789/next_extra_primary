/**
 * useCanvasKeyboard Hook
 * Keyboard shortcuts for canvas operations
 */

import { useEffect, useCallback } from 'react';
import type {
  KeyboardHandlers,
  UseCanvasKeyboardOptions,
} from './canvasKeyboardTypes';

export type {
  KeyboardHandlers,
  UseCanvasKeyboardOptions,
} from './canvasKeyboardTypes';

/**
 * Hook for canvas keyboard shortcuts
 */
export function useCanvasKeyboard(
  handlers: KeyboardHandlers = {},
  options: UseCanvasKeyboardOptions
) {
  const {
    dispatch,
    selectedItemIds,
    clearSelectionAction,
  } = options;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;

      if (meta && e.key === 'a') {
        e.preventDefault();
        handlers.onSelectAll?.();
      }

      if (
        e.key === 'Delete' ||
        e.key === 'Backspace'
      ) {
        if (selectedItemIds.size > 0) {
          e.preventDefault();
          handlers.onDeleteSelected?.();
        }
      }

      if (meta && e.key === 'd') {
        e.preventDefault();
        if (selectedItemIds.size > 0) {
          handlers.onDuplicateSelected?.();
        }
      }

      if (meta && e.key === 'f') {
        e.preventDefault();
        handlers.onSearch?.();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        dispatch(clearSelectionAction());
      }
    },
    [
      selectedItemIds,
      dispatch,
      handlers,
      clearSelectionAction,
    ]
  );

  useEffect(() => {
    window.addEventListener(
      'keydown',
      handleKeyDown
    );
    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [handleKeyDown]);
}

export default useCanvasKeyboard;
