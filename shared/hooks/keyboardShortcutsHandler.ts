/**
 * Keyboard shortcut event handler logic
 */

import type { KeyboardShortcut } from './keyboardShortcutsTypes'

/** Extended shortcut with debounce timer */
export type ShortcutEntry = KeyboardShortcut & {
  timeoutId?: NodeJS.Timeout
}

/**
 * Check whether a keyboard event matches a shortcut
 * @param event - The keyboard event to test
 * @param shortcut - The shortcut definition
 * @param isMac - Whether platform is macOS
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut,
  isMac: boolean
): boolean {
  const keyMatch =
    event.key.toLowerCase() ===
    shortcut.key.toLowerCase()

  const metaOk = (() => {
    if (shortcut.cmd) {
      return isMac ? event.metaKey : false
    }
    if (shortcut.ctrl) {
      return isMac
        ? event.metaKey
        : event.ctrlKey
    }
    return !shortcut.cmd && !shortcut.ctrl
  })()

  const shiftOk = shortcut.shift
    ? event.shiftKey
    : true
  const altOk = shortcut.alt
    ? event.altKey
    : true

  return keyMatch && metaOk && shiftOk && altOk
}

/**
 * Handle a matched shortcut with debounce
 * @param id - The shortcut registration ID
 * @param shortcut - The shortcut entry
 * @param event - The keyboard event
 * @param shortcuts - The shortcuts map (mutated)
 */
export function handleShortcutMatch(
  id: string,
  shortcut: ShortcutEntry,
  event: KeyboardEvent,
  shortcuts: Map<string, ShortcutEntry>
): void {
  if (shortcut.preventDefault) {
    event.preventDefault()
  }
  if (shortcut.debounce) {
    if (shortcut.timeoutId) {
      clearTimeout(shortcut.timeoutId)
    }
    const tid = setTimeout(
      () => shortcut.onPress(),
      shortcut.debounce
    )
    shortcuts.set(id, {
      ...shortcut,
      timeoutId: tid,
    })
  } else {
    shortcut.onPress()
  }
}
