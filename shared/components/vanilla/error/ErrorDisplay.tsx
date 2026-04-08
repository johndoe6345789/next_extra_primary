'use client'

import { createElement } from 'react'
import type { ErrorDisplayProps } from './types'

/**
 * Simple error display for non-boundary error states.
 *
 * @param props - Component props.
 */
export function ErrorDisplay({
  error,
  title = 'An error occurred',
  onRetry,
  className,
  style,
}: ErrorDisplayProps) {
  if (!error) return null

  const msg = typeof error === 'string'
    ? error : error.message

  return createElement('div', {
    className: `error-display ${className ?? ''}`,
    style: {
      padding: '16px',
      backgroundColor: '#fff5f5',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      ...style,
    },
  },
    createElement('h3', {
      style: {
        color: '#c92a2a',
        margin: '0 0 8px 0',
        fontSize: '16px',
      },
    }, title),
    createElement('p', {
      style: {
        color: '#495057',
        margin: '0',
        fontSize: '14px',
      },
    }, msg),
    onRetry && createElement('button', {
      onClick: onRetry,
      style: {
        marginTop: '12px',
        padding: '8px 16px',
        backgroundColor: '#228be6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
      },
    }, 'Try again'),
  )
}
