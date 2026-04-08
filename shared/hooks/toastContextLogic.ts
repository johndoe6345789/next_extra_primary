'use client'

/**
 * Toast context provider core logic
 */

import { useCallback, useRef } from 'react'
import type {
  Toast,
  ToastOptions,
} from './toastContextTypes'

let toastIdCounter = 0

/** Generate a unique toast ID */
export const generateToastContextId = () =>
  `toast-${++toastIdCounter}`

/**
 * Create toast timer management callbacks
 * @param timers - Ref to timer map
 */
export function useToastContextTimers(
  timers: React.RefObject<
    Map<string, ReturnType<typeof setTimeout>>
  >
) {
  const clearTimer = useCallback(
    (id: string) => {
      const t = timers.current.get(id)
      if (t) {
        clearTimeout(t)
        timers.current.delete(id)
      }
    },
    [timers]
  )

  return { clearTimer }
}

/**
 * Build a Toast from options
 * @param opts - Toast options or string
 * @param defaults - Default settings
 */
export function buildContextToast(
  opts: ToastOptions | string,
  defaults: {
    autoHideDuration: number
    anchorOrigin: {
      vertical: 'top' | 'bottom'
      horizontal: 'left' | 'center' | 'right'
    }
  }
): Toast {
  const o: ToastOptions =
    typeof opts === 'string'
      ? { message: opts }
      : opts
  const id = o.key || generateToastContextId()

  return {
    id,
    message: o.message,
    severity: o.severity || 'info',
    autoHideDuration:
      o.autoHideDuration ??
      defaults.autoHideDuration,
    action: o.action,
    onClose: o.onClose,
    anchorOrigin:
      o.anchorOrigin || defaults.anchorOrigin,
  }
}
