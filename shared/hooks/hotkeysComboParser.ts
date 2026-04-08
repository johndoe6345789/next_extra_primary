/**
 * Hotkey combo parsing and platform detection
 */

import type { ParsedCombo } from './hotkeysTypes'

/** Parse a combo string into modifiers + key */
export const parseCombo = (
  combo: string
): ParsedCombo => {
  const parts = combo.toLowerCase().split('+')
  const parsed: ParsedCombo = {
    ctrl: false,
    cmd: false,
    shift: false,
    alt: false,
    meta: false,
    key: '',
  }

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].trim()
    if (
      part === 'ctrl' || part === 'control'
    ) {
      parsed.ctrl = true
    }
    if (part === 'cmd' || part === 'command') {
      parsed.cmd = true
    }
    if (part === 'shift') parsed.shift = true
    if (
      part === 'alt' ||
      part === 'option' ||
      part === 'opt'
    ) {
      parsed.alt = true
    }
    if (part === 'meta') parsed.meta = true
  }

  parsed.key = parts[parts.length - 1].trim()
  return parsed
}

/** Detect if running on macOS */
export const isMac = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Mac|iPhone|iPad|iPod/.test(
    navigator.platform || ''
  )
}
