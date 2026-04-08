/**
 * Type definitions for ErrorDisplay component.
 */
import type { ReactNode } from 'react'

/** Props for the ErrorDisplay component */
export interface ErrorDisplayProps {
  /** The error to display */
  error: Error | string
  /** Error title */
  title?: string
  /** Whether to show stack trace toggle */
  showStackTrace?: boolean
  /** Whether to show copy button */
  showCopyButton?: boolean
  /** Whether to show reload button */
  showReloadButton?: boolean
  /** Custom reload handler */
  onReload?: () => void
  /** Custom icon */
  icon?: ReactNode
  /** Additional content to render */
  children?: ReactNode
  /** Custom className */
  className?: string
  /** Test ID for testing */
  testId?: string
}
