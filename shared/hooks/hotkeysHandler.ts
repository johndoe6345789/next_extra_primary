/**
 * Hotkey event matching logic
 */

import type { RegisteredHotkey } from './hotkeysTypes'

/**
 * Test if a keyboard event matches a hotkey
 * @param event - The keyboard event
 * @param hotkey - The registered hotkey entry
 * @param isMac - Whether platform is macOS
 * @returns true if the event matches
 */
export function matchesHotkey(
  event: KeyboardEvent,
  hotkey: RegisteredHotkey,
  isMac: boolean
): boolean {
  if (!hotkey.options.enabled) return false

  const { combo } = hotkey
  const isKeyMatch =
    event.key.toLowerCase() ===
    combo.key.toLowerCase()

  const isMetaOk = (() => {
    if (combo.cmd && combo.ctrl) {
      return isMac
        ? event.metaKey
        : event.ctrlKey
    }
    if (combo.cmd) {
      return isMac ? event.metaKey : false
    }
    if (combo.ctrl) {
      return isMac
        ? event.metaKey
        : event.ctrlKey
    }
    return true
  })()

  const isShiftOk = combo.shift
    ? event.shiftKey
    : true
  const isAltOk = combo.alt
    ? event.altKey
    : true
  const isMetaKeyOk = combo.meta
    ? event.metaKey
    : true

  return (
    isKeyMatch &&
    isMetaOk &&
    isShiftOk &&
    isAltOk &&
    isMetaKeyOk
  )
}

/**
 * Process a matched hotkey with debouncing
 * @param event - The keyboard event
 * @param hotkey - The registered hotkey (mutated)
 * @returns true if the hotkey fired
 */
export function processHotkeyMatch(
  event: KeyboardEvent,
  hotkey: RegisteredHotkey
): boolean {
  const now = Date.now()
  if (
    hotkey.options.debounceMs &&
    now - hotkey.lastTriggeredAt <
      hotkey.options.debounceMs
  ) {
    return false
  }
  if (hotkey.options.preventDefault) {
    event.preventDefault()
  }
  hotkey.lastTriggeredAt = now
  hotkey.handler()
  return true
}
