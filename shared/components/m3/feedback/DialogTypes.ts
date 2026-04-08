/**
 * Type definitions for the Dialog component.
 */
import type React from 'react'

/** Props for the Dialog component */
export interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | false
  fullWidth?: boolean
  fullScreen?: boolean
  disableEscapeKeyDown?: boolean
  disableBackdropClick?: boolean
  /** Test ID for automated testing */
  testId?: string
  /** ID of the labelling element */
  'aria-labelledby'?: string
}
