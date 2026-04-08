'use client'

/**
 * ErrorDisplay - error alert with optional stack
 * trace, copy, and reload functionality.
 */

import { useState } from 'react'
import { Alert, AlertTitle } from './Alert'
import { Button } from '../inputs/Button'
import { ErrorStackTrace } from './ErrorDisplayStack'
import type { ErrorDisplayProps } from './ErrorDisplayTypes'

export type { ErrorDisplayProps } from './ErrorDisplayTypes'

/**
 * Renders an error alert with message, copy button,
 * stack trace toggle, and optional reload button.
 */
export function ErrorDisplay({
  error,
  title = 'An error occurred',
  showStackTrace = true,
  showCopyButton = true,
  showReloadButton = false,
  onReload,
  icon,
  children,
  className = '',
  testId,
}: ErrorDisplayProps) {
  const [copied, setCopied] = useState(false)

  const msg = typeof error === 'string'
    ? error : error.message
  const stack = typeof error === 'string'
    ? undefined : error.stack

  const details = `Error: ${msg}\n\nStack Trace:\n${stack || 'No stack trace available'}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const handleReload = () => {
    if (onReload) onReload()
    else window.location.reload()
  }

  return (
    <div
      className={`space-y-4 ${className}`}
      data-testid={testId ?? 'error-display'}
      role="alert"
    >
      <Alert severity="error" data-testid="error-alert" role="alert">
        {icon}
        <AlertTitle>{title}</AlertTitle>
        <div className="mt-3 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <code className="text-sm bg-destructive/20 px-2 py-1 rounded flex-1 break-all" data-testid="error-message">
              {msg}
            </code>
            {showCopyButton && (
              <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0" data-testid="copy-error-btn" aria-label="Copy error details">
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          {showStackTrace && stack && (
            <ErrorStackTrace stack={stack} />
          )}
        </div>
      </Alert>
      {children}
      {showReloadButton && (
        <Button onClick={handleReload} className="w-full" variant="outline" data-testid="reload-btn" aria-label="Try reloading the page">
          Try Reloading
        </Button>
      )}
    </div>
  )
}
