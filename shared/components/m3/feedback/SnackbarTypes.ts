/**
 * Type definitions for Snackbar components.
 */
import type React from 'react'

/** Anchor position */
export interface SnackbarAnchorOrigin {
  vertical?: 'top' | 'bottom'
  horizontal?: 'left' | 'center' | 'right'
}

/** Props for the Snackbar container */
export interface SnackbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  open?: boolean
  anchorOrigin?: SnackbarAnchorOrigin
  autoHideDuration?: number | null
  onClose?: (
    event: React.SyntheticEvent | Event | null,
    reason: 'timeout' | 'clickaway' | 'escapeKeyDown',
  ) => void
  message?: React.ReactNode
  action?: React.ReactNode
  resumeHideDuration?: number
  transitionDuration?: number
  testId?: string
}

/** Props for the SnackbarContent message panel */
export interface SnackbarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: React.ReactNode
  action?: React.ReactNode
  severity?:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
}
