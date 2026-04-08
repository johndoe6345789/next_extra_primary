'use client'

/**
 * Toast context shorthand method factories
 */

import { useCallback } from 'react'
import type {
  ToastOptions,
  ToastContextValue,
} from './toastContextTypes'

type ToastFn = (
  opts: ToastOptions | string
) => string

type ShorthandOpts = Omit<
  ToastOptions,
  'message' | 'severity'
>

/**
 * Create shorthand toast context methods
 * @param toast - Core toast function
 * @returns success, error, warning, info fns
 */
export function useToastContextShorthand(
  toast: ToastFn
): Pick<
  ToastContextValue,
  'success' | 'error' | 'warning' | 'info'
> {
  const success = useCallback(
    (m: string, o?: ShorthandOpts) =>
      toast({
        ...o,
        message: m,
        severity: 'success',
      }),
    [toast]
  )

  const error = useCallback(
    (m: string, o?: ShorthandOpts) =>
      toast({
        ...o,
        message: m,
        severity: 'error',
      }),
    [toast]
  )

  const warning = useCallback(
    (m: string, o?: ShorthandOpts) =>
      toast({
        ...o,
        message: m,
        severity: 'warning',
      }),
    [toast]
  )

  const info = useCallback(
    (m: string, o?: ShorthandOpts) =>
      toast({
        ...o,
        message: m,
        severity: 'info',
      }),
    [toast]
  )

  return { success, error, warning, info }
}
