'use client'

/**
 * Type definitions for ToastContext
 */

import React from 'react'

export type ToastSeverity =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

export interface ToastOptions {
  message: string
  severity?: ToastSeverity
  autoHideDuration?: number | null
  action?: React.ReactNode
  key?: string
  onClose?: () => void
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

export interface Toast extends Required<
  Pick<
    ToastOptions,
    'message' | 'severity' | 'autoHideDuration'
  >
> {
  id: string
  action?: React.ReactNode
  onClose?: () => void
  anchorOrigin: NonNullable<
    ToastOptions['anchorOrigin']
  >
}

export interface ToastContextValue {
  toast: (options: ToastOptions | string) => string
  success: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  error: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  warning: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  info: (
    message: string,
    options?: Omit<
      ToastOptions, 'message' | 'severity'
    >
  ) => string
  close: (id: string) => void
  closeAll: () => void
}

export interface ToastProviderProps {
  children: React.ReactNode
  defaultAutoHideDuration?: number
  maxToasts?: number
  defaultAnchorOrigin?: ToastOptions['anchorOrigin']
}
