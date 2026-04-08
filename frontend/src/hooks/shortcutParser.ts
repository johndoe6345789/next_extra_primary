/**
 * Keyboard shortcut parsing and matching utilities.
 * @module hooks/shortcutParser
 */

/** Tags where shortcuts are suppressed. */
export const IGNORED_TAGS = new Set([
  'INPUT', 'TEXTAREA', 'SELECT',
]);

/** Parsed representation of a shortcut combo. */
export interface ParsedCombo {
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
export function parseCombo(
  combo: string,
): ParsedCombo {
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
export function matchesCombo(
  e: KeyboardEvent,
  p: ParsedCombo,
): boolean {
  const isMac = navigator.userAgent.includes('Mac');
  const ctrlOk = p.ctrl
    ? e.ctrlKey || (isMac && e.metaKey)
    : !e.ctrlKey && !(isMac && e.metaKey);
  const shiftOk = p.shift === e.shiftKey;
  const altOk = p.alt === e.altKey;
  const metaOk = p.meta
    ? e.metaKey
    : !e.metaKey
      || (isMac && p.ctrl
        && e.metaKey && !e.ctrlKey);
  return (
    ctrlOk && shiftOk && altOk && metaOk
    && e.key.toLowerCase() === p.key
  );
}
