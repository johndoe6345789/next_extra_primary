'use client'

/**
 * Error Handling Components
 *
 * Catches JavaScript errors in child component
 * tree and displays fallback UI.
 */

export type {
  ErrorReporter,
  ErrorBoundaryProps,
  ErrorDisplayProps,
} from './types'

export { ErrorBoundary } from './ErrorBoundary'
export { withErrorBoundary } from './withErrorBoundary'
export { ErrorDisplay } from './ErrorDisplay'
