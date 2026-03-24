'use client';

import { useEffect } from 'react';

/** Map of key identifiers to handler functions. */
type ShortcutMap = Record<string, () => void>;

/** Tags where shortcuts should be suppressed. */
const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Registers global keyboard shortcuts that fire on
 * keydown. Shortcuts are suppressed when the active
 * element is an input, textarea, or select.
 *
 * Key identifiers should match KeyboardEvent.key
 * values (e.g. "Escape", "k", "/").
 *
 * @param shortcuts - Map of key names to handlers.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName ?? '';
      if (IGNORED_TAGS.has(tag)) return;

      const fn = shortcuts[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [shortcuts]);
}

export default useKeyboardShortcuts;
