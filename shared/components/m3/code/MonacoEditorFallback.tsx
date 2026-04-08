'use client'

import React from 'react'

export interface MonacoEditorFallbackProps {
  height: string
}

/**
 * Loading skeleton shown while Monaco
 * editor loads asynchronously.
 */
export function MonacoEditorFallback({
  height,
}: MonacoEditorFallbackProps) {
  return (
    <div
      className="animate-pulse bg-muted rounded-md"
      style={{ height }}
      data-testid="monaco-editor-skeleton"
      role="status"
      aria-busy="true"
      aria-label="Loading code editor"
    />
  )
}
