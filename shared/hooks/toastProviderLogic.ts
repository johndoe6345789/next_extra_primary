'use client'

/**
 * Toast provider core logic
 */

import { useCallback, useRef } from 'react'
import type {
  Toast,
  ToastOptions,
} from './toastTypes'

let toastIdCounter = 0

/** Generate a unique toast ID */
export const generateToastId = () =>
  `toast-${++toastIdCounter}`

/**
 * Create toast timer management callbacks
 * @param timers - Ref to timer map
 */
export function useToastTimers(
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
 * Build a Toast object from options
 * @param opts - Raw toast options or string
 * @param defaults - Default durations/anchors
 */
export function buildToast(
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
  const id = o.key || generateToastId()

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
