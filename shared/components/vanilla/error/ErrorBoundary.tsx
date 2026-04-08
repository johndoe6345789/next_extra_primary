'use client'

import {
  Component, type ReactNode,
  type ErrorInfo, createElement,
} from 'react'
import type {
  ErrorBoundaryProps, ErrorBoundaryState,
} from './types'
import { renderFallbackUI } from './fallbackUI'

/**
 * Error Boundary that catches JS errors in child
 * component tree and displays fallback UI.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps, ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false, error: null, errorCount: 0,
    }
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  override componentDidCatch(
    error: Error, errorInfo: ErrorInfo,
  ): void {
    const errorCount = this.state.errorCount + 1

    if (this.props.errorReporter) {
      this.props.errorReporter.reportError(error, {
        component:
          errorInfo.componentStack ?? undefined,
        ...this.props.context,
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error)
      console.error('Stack:', errorInfo.componentStack)
    }

    this.setState({ errorCount })
    this.props.onError?.(error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleReload = () => {
    window.location.reload()
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback
      }

      const msg = this.state.error
        ? (this.props.errorReporter?.getUserMessage?.(
            this.state.error,
          ) ?? this.state.error.message)
        : 'An error occurred while rendering.'

      return renderFallbackUI(
        msg,
        this.state.error,
        this.state.errorCount,
        this.handleRetry,
        this.handleReload,
      )
    }

    return this.props.children
  }
}
