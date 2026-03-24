'use client';

import { useEffect } from 'react';

/**
 * Map of combo strings (e.g. `"ctrl+shift+d"`,
 * `"/"`, `"Escape"`) to handler functions.
 */
export type ShortcutMap = Record<string, () => void>;

/** Tags where shortcuts are suppressed. */
const IGNORED = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/** Parsed representation of a shortcut combo. */
interface ParsedCombo {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  key: string;
}

/**
 * Parse a combo string like `"ctrl+shift+d"` into
 * its modifier flags and the final key.
 *
 * @param combo - The combo string to parse.
 * @returns Parsed modifier flags and key.
 */
function parseCombo(combo: string): ParsedCombo {
  const parts = combo.toLowerCase().split('+');
  const key = parts.pop() ?? '';
  const mods = new Set(parts);
  return {
    ctrl: mods.has('ctrl'),
    shift: mods.has('shift'),
    alt: mods.has('alt'),
    meta: mods.has('meta'),
    key,
  };
}

/**
 * Check whether a keyboard event matches a parsed
 * combo. On Mac, `ctrl` in the combo also accepts
 * `metaKey` for user convenience.
 *
 * @param e - The keyboard event.
 * @param p - The parsed combo to match against.
 * @returns True if the event matches the combo.
 */
function matches(e: KeyboardEvent, p: ParsedCombo): boolean {
  const isMac = navigator.userAgent.includes('Mac');
  const ctrlOk = p.ctrl
    ? e.ctrlKey || (isMac && e.metaKey)
    : !e.ctrlKey && !(isMac && e.metaKey);
  const shiftOk = p.shift === e.shiftKey;
  const altOk = p.alt === e.altKey;
  const metaOk = p.meta
    ? e.metaKey
    : !e.metaKey || (isMac && p.ctrl && e.metaKey && !e.ctrlKey);
  return ctrlOk && shiftOk && altOk && metaOk && e.key.toLowerCase() === p.key;
}

/**
 * Registers global keyboard shortcuts on keydown.
 * Supports modifier combos like `"ctrl+shift+d"`.
 * Suppressed in INPUT/TEXTAREA/SELECT except Escape.
 *
 * @param shortcuts - Map of combo strings to handlers.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  useEffect(() => {
    const entries = Object.entries(shortcuts).map(
      ([combo, fn]) => [parseCombo(combo), fn] as const,
    );
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inInput = IGNORED.has(tag ?? '');
      for (const [parsed, fn] of entries) {
        if (matches(e, parsed)) {
          if (inInput && parsed.key !== 'escape') return;
          e.preventDefault();
          fn();
          return;
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [shortcuts]);
}

export default useKeyboardShortcuts;
