'use client'

/**
 * useToast consumer hook and context creation
 */

import { createContext, useContext } from 'react'
import type {
  ToastContextValue,
} from './toastTypes'

/** Toast notification context */
export const ToastContext =
  createContext<ToastContextValue | null>(null)

/**
 * Hook to access toast notifications.
 * Must be used within a ToastProvider.
 * @returns Toast context value
 * @throws Error if used outside ToastProvider
 */
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error(
      'useToast must be used within ToastProvider'
    )
  }
  return ctx
}
