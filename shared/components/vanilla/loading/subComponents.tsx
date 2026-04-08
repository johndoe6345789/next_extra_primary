'use client'

import React from 'react'

export { ProgressBar } from './ProgressBar'
export { DotsAnimation } from './DotsAnimation'

/** @internal Icon props for loading. */
interface IconProps {
  size: string
}

/** Spinning circle indicator. */
export function SpinnerIcon({
  size,
}: IconProps) {
  return (
    <div
      className="loading-spinner"
      style={{
        width: size,
        height: size,
        border: '3px solid #e0e0e0',
        borderTopColor: '#228be6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  )
}

/** Pulsing circle indicator. */
export function PulseIcon({
  size,
}: IconProps) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#228be6',
      animation:
        'pulse-animation 2s ease-in-out infinite',
    }} />
  )
}
