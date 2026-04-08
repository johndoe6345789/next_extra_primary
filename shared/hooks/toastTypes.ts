'use client'

/**
 * Type definitions for useToast hook
 */

import React from 'react'

export type ToastSeverity =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

export interface ToastOptions {
  /** Toast message content */
  message: string
  /** Severity level for styling */
  severity?: ToastSeverity
  /** Auto hide duration in ms (null to disable) */
  autoHideDuration?: number | null
  /** Action button content */
  action?: React.ReactNode
  /** Custom key for deduplication */
  key?: string
  /** Callback when toast closes */
  onClose?: () => void
  /** Anchor position */
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

export type {
  ToastContextValue,
  ToastProviderProps,
} from './toastProviderTypes'
