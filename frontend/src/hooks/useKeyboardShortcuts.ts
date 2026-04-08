'use client';

import { useEffect } from 'react';
import {
  parseCombo, matchesCombo, IGNORED_TAGS,
} from './shortcutParser';

/**
 * Map of combo strings (e.g. `"ctrl+shift+d"`,
 * `"/"`, `"Escape"`) to handler functions.
 */
export type ShortcutMap = Record<string, () => void>;

/**
 * Registers global keyboard shortcuts on keydown.
 * Supports modifier combos like `"ctrl+shift+d"`.
 * Suppressed in INPUT/TEXTAREA/SELECT except
 * Escape.
 *
 * @param shortcuts - Map of combo strings to
 *   handlers.
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
): void {
  useEffect(() => {
    const entries = Object.entries(shortcuts).map(
      ([combo, fn]) =>
        [parseCombo(combo), fn] as const,
    );
    const handler = (e: KeyboardEvent) => {
      const tag =
        (e.target as HTMLElement)?.tagName;
      const inInput = IGNORED_TAGS.has(tag ?? '');
      for (const [parsed, fn] of entries) {
        if (matchesCombo(e, parsed)) {
          if (inInput && parsed.key !== 'escape') {
            return;
          }
          e.preventDefault();
          fn();
          return;
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener(
        'keydown', handler,
      );
    };
  }, [shortcuts]);
}

export default useKeyboardShortcuts;
