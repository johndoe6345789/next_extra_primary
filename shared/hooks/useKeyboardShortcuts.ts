/**
 * useKeyboardShortcuts Hook
 * Unified keyboard shortcut handling
 */

import { useRef, useCallback } from 'react'
import type {
  KeyboardShortcut,
  UseKeyboardShortcutsReturn,
} from './keyboardShortcutsTypes'
import type {
  ShortcutEntry,
} from './keyboardShortcutsHandler'
import {
  useShortcutEffect,
} from './keyboardShortcutsEffect'

export type {
  KeyboardShortcut,
  UseKeyboardShortcutsReturn,
} from './keyboardShortcutsTypes'

const isMac = () => {
  if (typeof window === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/.test(
    navigator.platform || ''
  )
}

/** Hook for keyboard shortcut management */
export function useKeyboardShortcuts():
  UseKeyboardShortcutsReturn {
  const shortcutsRef = useRef<
    Map<string, ShortcutEntry>
  >(new Map())
  const platformIsMac = useRef(isMac())

  const registerShortcut = useCallback(
    (shortcut: KeyboardShortcut): string => {
      const id =
        `shortcut-${Date.now()}-` +
        Math.random().toString(36).substr(2, 9)
      shortcutsRef.current.set(id, shortcut)
      return id
    },
    []
  )

  const unregister = useCallback(
    (id: string) => {
      const s = shortcutsRef.current.get(id)
      if (s?.timeoutId) clearTimeout(s.timeoutId)
      shortcutsRef.current.delete(id)
    },
    []
  )

  const clearAll = useCallback(() => {
    shortcutsRef.current.forEach((s) => {
      if (s.timeoutId) clearTimeout(s.timeoutId)
    })
    shortcutsRef.current.clear()
  }, [])

  useShortcutEffect(
    shortcutsRef, platformIsMac.current
  )

  return {
    registerShortcut,
    unregister,
    clearAll,
  }
}
