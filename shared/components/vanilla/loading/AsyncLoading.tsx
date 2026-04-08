'use client'

import React from 'react'
import type { AsyncLoadingProps } from './types'
import { LoadingIndicator } from './LoadingIndicator'

/**
 * Loading state wrapper for async operations
 * with skeleton fallback.
 *
 * @param props - Component props.
 */
export function AsyncLoading({
  isLoading,
  error,
  children,
  skeletonComponent,
  errorComponent,
  loadingMessage,
}: AsyncLoadingProps) {
  if (isLoading) {
    return skeletonComponent ?? (
      <LoadingIndicator show message={loadingMessage} />
    )
  }

  if (error) {
    return errorComponent ?? (
      <div style={{ color: '#c92a2a', padding: '16px' }}>
        Error loading content
      </div>
    )
  }

  return <>{children}</>
}
