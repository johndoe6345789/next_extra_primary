'use client'

import { createElement, type ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import type { ErrorReporter } from './types'

/**
 * Higher-order component to wrap any component
 * with an error boundary.
 *
 * @param Wrapped - Component to wrap.
 * @param fallback - Custom fallback UI.
 * @param context - Error reporting context.
 * @param reporter - Error reporter instance.
 */
export function withErrorBoundary<P extends object>(
  Wrapped: React.ComponentType<P>,
  fallback?: ReactNode,
  context?: Record<string, unknown>,
  reporter?: ErrorReporter,
): React.ComponentType<P> {
  const name = Wrapped.name !== ''
    ? Wrapped.name : undefined
  const displayName =
    Wrapped.displayName ?? name ?? 'Component'

  const Comp = (props: P) =>
    createElement(
      ErrorBoundary,
      { fallback, context, errorReporter: reporter },
      createElement(Wrapped, props),
    )

  Comp.displayName =
    `withErrorBoundary(${displayName})`
  return Comp
}
