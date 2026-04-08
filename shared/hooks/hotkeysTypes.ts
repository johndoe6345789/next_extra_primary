/**
 * Type definitions and utilities for useHotkeys
 */

/** Options for hotkey registration */
export interface HotkeysOptions {
  /** Prevent default on hotkey press */
  preventDefault?: boolean
  /** Whether this hotkey is enabled */
  enabled?: boolean
  /** Debounce delay in milliseconds */
  debounceMs?: number
}

/** Return type of useHotkeys */
export interface UseHotkeysReturn {
  /** Register a hotkey combo; returns ID */
  register: (
    combo: string,
    handler: () => void,
    options?: HotkeysOptions
  ) => string
  /** Unregister a hotkey by ID */
  unregister: (id: string) => void
  /** Unregister all hotkeys */
  unregisterAll: () => void
}

/** Parsed key combination */
export interface ParsedCombo {
  ctrl: boolean
  cmd: boolean
  shift: boolean
  alt: boolean
  meta: boolean
  key: string
}

/** Internal registered hotkey entry */
export interface RegisteredHotkey {
  combo: ParsedCombo
  handler: () => void
  options: HotkeysOptions
  lastTriggeredAt: number
}

export {
  parseCombo,
  isMac,
} from './hotkeysComboParser'
