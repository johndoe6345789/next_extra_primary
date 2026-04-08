import type { ShortcutItem } from './shortcutTypes'

/**
 * Detect platform and return modifier key symbol.
 */
export function getPlatformModifier(): string {
  if (
    typeof navigator !== 'undefined'
    && navigator.platform?.includes('Mac')
  ) {
    return '\u2318'
  }
  return 'Ctrl'
}

/**
 * Create a shortcut with platform-aware modifier.
 *
 * @param modifiers - Modifier keys to include.
 * @param key - The primary key.
 * @param description - What the shortcut does.
 */
export function createShortcut(
  modifiers: ('ctrl' | 'shift' | 'alt')[],
  key: string,
  description: string,
): ShortcutItem {
  const ctrlKey = getPlatformModifier()
  const isMac =
    typeof navigator !== 'undefined'
    && navigator.platform?.includes('Mac')

  const keys = modifiers.map((mod) => {
    switch (mod) {
      case 'ctrl':
        return ctrlKey
      case 'shift':
        return 'Shift'
      case 'alt':
        return isMac ? '\u2325' : 'Alt'
    }
  })
  keys.push(key)

  return { keys, description }
}
