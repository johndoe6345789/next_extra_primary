'use client'

import React from 'react'
import type { InlineLoaderProps } from './types'

const SIZE_MAP = { small: '16px', medium: '20px' }

/**
 * Inline loading spinner for buttons and text.
 *
 * @param props - Component props.
 */
export function InlineLoader({
  loading = true,
  size = 'small',
  style,
}: InlineLoaderProps) {
  if (!loading) return null

  return (
    <div
      className="loading-spinner"
      style={{
        display: 'inline-block',
        width: SIZE_MAP[size],
        height: SIZE_MAP[size],
        border: '2px solid #e0e0e0',
        borderTopColor: '#228be6',
        borderRadius: '50%',
        marginRight: '8px',
        animation: 'spin 1s linear infinite',
        ...style,
      }}
    />
  )
}
