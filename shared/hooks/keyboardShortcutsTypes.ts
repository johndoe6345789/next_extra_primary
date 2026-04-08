/**
 * Type definitions for useKeyboardShortcuts
 */

/** Keyboard shortcut definition */
export interface KeyboardShortcut {
  /** Key (e.g. 's', 'Enter', 'ArrowUp') */
  key: string
  /** Trigger on Ctrl (Windows/Linux) */
  ctrl?: boolean
  /** Trigger on Cmd (macOS) */
  cmd?: boolean
  /** Trigger on Shift */
  shift?: boolean
  /** Trigger on Alt */
  alt?: boolean
  /** Callback when triggered */
  onPress: () => void
  /** Whether to preventDefault */
  preventDefault?: boolean
  /** Debounce delay in ms */
  debounce?: number
}

/** Return type of useKeyboardShortcuts */
export interface UseKeyboardShortcutsReturn {
  /** Register shortcut; returns ID */
  registerShortcut: (
    shortcut: KeyboardShortcut
  ) => string
  /** Unregister by ID */
  unregister: (id: string) => void
  /** Clear all shortcuts */
  clearAll: () => void
}
