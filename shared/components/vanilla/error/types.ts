import type { ReactNode, ErrorInfo } from 'react'

/**
 * Error reporting interface for custom handling.
 */
export interface ErrorReporter {
  reportError: (
    error: Error,
    context?: Record<string, unknown>,
  ) => void
  getUserMessage?: (error: Error) => string
}

/** Props for the ErrorBoundary component. */
export interface ErrorBoundaryProps {
  children?: ReactNode
  /** Custom fallback UI to show on error */
  fallback?: ReactNode
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Context for error reporting */
  context?: Record<string, unknown>
  /** Optional error reporter integration */
  errorReporter?: ErrorReporter
}

/** Internal state for ErrorBoundary. */
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorCount: number
}

/** Props for the ErrorDisplay component. */
export interface ErrorDisplayProps {
  error: Error | string | null
  title?: string
  onRetry?: () => void
  className?: string
  style?: React.CSSProperties
}
