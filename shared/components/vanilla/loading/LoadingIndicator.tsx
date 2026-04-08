'use client'

import React from 'react'
import type { LoadingIndicatorProps } from './types'
import {
  SpinnerIcon,
  PulseIcon,
  ProgressBar,
  DotsAnimation,
} from './subComponents'

const SIZE_MAP = { small: '24px', medium: '40px', large: '60px' }

/**
 * Loading indicator with multiple display modes.
 *
 * @param props - Component props.
 */
export function LoadingIndicator({
  show = true,
  message,
  variant = 'spinner',
  size = 'medium',
  fullPage = false,
  className,
  style,
}: LoadingIndicatorProps) {
  if (!show) return null

  const containerStyle: React.CSSProperties = fullPage
    ? {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        ...style,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        ...style,
      }

  const fs = size === 'small'
    ? '12px' : size === 'large' ? '16px' : '14px'

  return (
    <div
      className={
        `loading-indicator loading-${variant} ${className ?? ''}`
      }
      style={containerStyle}
    >
      {variant === 'spinner' && (
        <SpinnerIcon size={SIZE_MAP[size]} />
      )}
      {variant === 'bar' && <ProgressBar size={size} />}
      {variant === 'dots' && <DotsAnimation size={size} />}
      {variant === 'pulse' && (
        <PulseIcon size={SIZE_MAP[size]} />
      )}
      {message && (
        <p style={{
          marginTop: '16px',
          color: fullPage ? '#ffffff' : '#495057',
          fontSize: fs,
          textAlign: 'center',
        }}>
          {message}
        </p>
      )}
    </div>
  )
}
