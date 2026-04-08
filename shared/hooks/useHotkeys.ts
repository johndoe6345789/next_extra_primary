/**
 * useHotkeys Hook
 * Global hotkey registration with combo keys
 */

import { useRef, useCallback } from 'react'
import type {
  UseHotkeysReturn,
  RegisteredHotkey,
} from './hotkeysTypes'
import { isMac } from './hotkeysTypes'
import {
  useHotkeyRegister,
  useHotkeyListener,
} from './hotkeysRegistration'

export type {
  HotkeysOptions,
  UseHotkeysReturn,
} from './hotkeysTypes'

/**
 * Hook for registering keyboard shortcuts
 */
export function useHotkeys(): UseHotkeysReturn {
  const hotkeysRef =
    useRef<Map<string, RegisteredHotkey>>(
      new Map()
    )
  const platformIsMac = useRef(isMac()).current

  const register = useHotkeyRegister(hotkeysRef)

  const unregister = useCallback(
    (id: string) => {
      hotkeysRef.current.delete(id)
    },
    []
  )

  const unregisterAll = useCallback(() => {
    hotkeysRef.current.clear()
  }, [])

  useHotkeyListener(hotkeysRef, platformIsMac)

  return { register, unregister, unregisterAll }
}
