/**
 * Formats a shortcut definition from
 * `keyboard-shortcuts.json` into a
 * platform-aware display string.
 *
 * @module lib/shortcutLabel
 */

/** Shape of a shortcut entry in the JSON config. */
export interface ShortcutDef {
  key: string;
  description: string;
  modifiers: string[];
}

const IS_MAC =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac');

const MOD_SYMBOLS: Record<string, string> = {
  ctrl: IS_MAC ? '⌘' : 'Ctrl',
  shift: IS_MAC ? '⇧' : 'Shift',
  alt: IS_MAC ? '⌥' : 'Alt',
  meta: IS_MAC ? '⌘' : 'Win',
};

const KEY_LABELS: Record<string, string> = {
  ArrowDown: '↓',
  ArrowUp: '↑',
  ArrowLeft: '←',
  ArrowRight: '→',
  Enter: '↵',
  Escape: 'Esc',
};

/**
 * Converts a shortcut definition to a compact
 * display label like `⌘⇧D` (Mac) or
 * `Ctrl+Shift+D` (Windows/Linux).
 *
 * @param def - Shortcut definition from JSON.
 * @returns Human-readable label string.
 */
export function shortcutLabel(def: ShortcutDef): string {
  const mods = def.modifiers.map((m) => MOD_SYMBOLS[m] ?? m);
  const key = KEY_LABELS[def.key] ?? def.key.toUpperCase();
  if (IS_MAC) {
    return [...mods, key].join('');
  }
  return [...mods, key].join('+');
}
