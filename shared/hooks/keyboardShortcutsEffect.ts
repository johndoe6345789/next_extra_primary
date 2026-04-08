/**
 * Keyboard shortcuts effect setup
 */

import { useEffect } from 'react'
import type { ShortcutEntry } from './keyboardShortcutsHandler'
import {
  matchesShortcut,
  handleShortcutMatch,
} from './keyboardShortcutsHandler'

/** Attach keydown listener for shortcuts */
export function useShortcutEffect(
  shortcutsRef: React.RefObject<
    Map<string, ShortcutEntry>
  >,
  isMac: boolean
) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      shortcutsRef.current.forEach((s, id) => {
        if (matchesShortcut(event, s, isMac)) {
          handleShortcutMatch(
            id, s, event,
            shortcutsRef.current
          )
        }
      })
    }

    window.addEventListener(
      'keydown', handleKeyDown
    )
    return () => {
      window.removeEventListener(
        'keydown', handleKeyDown
      )
      shortcutsRef.current.forEach((s) => {
        if (s.timeoutId) {
          clearTimeout(s.timeoutId)
        }
      })
    }
  }, [shortcutsRef, isMac])
}
