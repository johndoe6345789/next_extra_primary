'use client'

/**
 * Toast context and provider type definitions
 */

import React from 'react'
import type { Toast, ToastOptions } from './toastTypes'

/** Context value for toast notifications */
export interface ToastContextValue {
  /** Show a toast notification */
  toast: (
    options: ToastOptions | string
  ) => string
  /** Show a success toast */
  success: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  /** Show an error toast */
  error: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  /** Show a warning toast */
  warning: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  /** Show an info toast */
  info: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  /** Close a specific toast by ID */
  close: (id: string) => void
  /** Close all toasts */
  closeAll: () => void
}

/** Props for the ToastProvider component */
export interface ToastProviderProps {
  children: React.ReactNode
  /** Default auto hide duration in ms */
  defaultAutoHideDuration?: number
  /** Maximum toasts to show at once */
  maxToasts?: number
  /** Default anchor position */
  defaultAnchorOrigin?: ToastOptions[
    'anchorOrigin'
  ]
  /** Custom toast renderer (optional) */
  renderToast?: (
    toast: Toast,
    onClose: () => void
  ) => React.ReactNode
}
