'use client'

import React from 'react'

/** @internal Progress bar size props. */
interface ProgressBarProps {
  size: 'small' | 'medium' | 'large'
}

/** Horizontal progress bar indicator. */
export function ProgressBar({
  size,
}: ProgressBarProps) {
  const hMap = {
    small: '2px',
    medium: '4px',
    large: '6px',
  }
  return (
    <div style={{
      width: '200px',
      height: hMap[size],
      backgroundColor: '#e0e0e0',
      borderRadius: '2px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        backgroundColor: '#228be6',
        animation:
          'progress-animation 1.5s ease-in-out infinite',
        borderRadius: '2px',
      }} />
    </div>
  )
}
