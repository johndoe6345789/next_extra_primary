'use client'

/**
 * ToastContext - Snackbar toast notifications
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Snackbar, SnackbarContent } from '../feedback/Snackbar'
import type { Toast, ToastOptions, ToastContextValue, ToastProviderProps } from './toastContextTypes'
import { useToastContextTimers, buildContextToast } from './toastContextLogic'
import { useToastContextShorthand } from './toastContextShorthand'
import { ToastContext, useToast as useToastHook } from './toastContextConsumer'

export type { ToastSeverity, ToastOptions, ToastProviderProps } from './toastContextTypes'

/** Hook to access toast notifications */
export const useToast = useToastHook

export const ToastProvider: React.FC<
  ToastProviderProps
> = ({
  children, defaultAutoHideDuration = 5000,
  maxToasts = 3,
  defaultAnchorOrigin = {
    vertical: 'bottom', horizontal: 'left',
  },
}) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const { clearTimer } = useToastContextTimers(timers)
  const defaults = { autoHideDuration: defaultAutoHideDuration, anchorOrigin: defaultAnchorOrigin }

  const close = useCallback((id: string) => {
    clearTimer(id)
    setToasts((p) => {
      p.find((t) => t.id === id)?.onClose?.()
      return p.filter((t) => t.id !== id)
    })
  }, [clearTimer])

  const closeAll = useCallback(() => {
    timers.current.forEach((_, id) => clearTimer(id))
    setToasts([])
  }, [clearTimer])

  const toast = useCallback((opts: ToastOptions | string): string => {
    const nt = buildContextToast(opts, defaults)
    setToasts((p) => {
      const idx = p.findIndex((t) => t.id === nt.id)
      let next: Toast[]
      if (idx >= 0) { next = [...p]; next[idx] = nt }
      else {
        next = [...p, nt]
        if (next.length > maxToasts) { const r = next.shift(); if (r) clearTimer(r.id) }
      }
      return next
    })
    const dur = nt.autoHideDuration
    if (dur !== null && dur > 0) {
      clearTimer(nt.id)
      timers.current.set(nt.id, setTimeout(() => close(nt.id), dur))
    }
    return nt.id
  }, [defaults, maxToasts, clearTimer, close])

  const { success, error, warning, info } = useToastContextShorthand(toast)
  useEffect(() => () => { timers.current.forEach((t) => clearTimeout(t)) }, [])
  const ctx: ToastContextValue = { toast, success, error, warning, info, close, closeAll }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {toasts.map((t) => (
        <Snackbar key={t.id} open autoHideDuration={null} onClose={() => close(t.id)} anchorOrigin={t.anchorOrigin}>
          <SnackbarContent message={t.message} severity={t.severity} action={t.action} />
        </Snackbar>
      ))}
    </ToastContext.Provider>
  )
}

export default ToastProvider
