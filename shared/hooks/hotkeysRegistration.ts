/**
 * Hotkey registration and listener setup
 */

import { useEffect, useCallback } from 'react'
import type {
  HotkeysOptions,
  RegisteredHotkey,
} from './hotkeysTypes'
import { parseCombo } from './hotkeysTypes'
import {
  matchesHotkey,
  processHotkeyMatch,
} from './hotkeysHandler'

/**
 * Creates a register callback for hotkeys
 * @param hotkeysRef - Map of registered hotkeys
 */
export function useHotkeyRegister(
  hotkeysRef: React.RefObject<
    Map<string, RegisteredHotkey>
  >
) {
  return useCallback(
    (
      combo: string,
      handler: () => void,
      options: HotkeysOptions = {}
    ): string => {
      const id =
        `hotkey-${Date.now()}-` +
        Math.random().toString(36).substr(2, 9)
      hotkeysRef.current.set(id, {
        combo: parseCombo(combo),
        handler,
        options: {
          preventDefault: false,
          enabled: true,
          debounceMs: 0,
          ...options,
        },
        lastTriggeredAt: 0,
      })
      return id
    },
    [hotkeysRef]
  )
}

/**
 * Sets up the global keydown listener
 * @param hotkeysRef - Map of registered hotkeys
 * @param isMac - Whether platform is macOS
 */
export function useHotkeyListener(
  hotkeysRef: React.RefObject<
    Map<string, RegisteredHotkey>
  >,
  isMac: boolean
) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      hotkeysRef.current.forEach((hotkey) => {
        if (matchesHotkey(event, hotkey, isMac)) {
          processHotkeyMatch(event, hotkey)
        }
      })
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )
    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [hotkeysRef, isMac])
}
