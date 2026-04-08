'use client'

/**
 * CircularProgress - standalone SVG circular
 * loading indicator with determinate/indeterminate.
 */

import React from 'react'
import styles from '../../../scss/atoms/mat-progress.module.scss'
import type { CircularProgressProps } from './CircularProgressTypes'

export type { CircularProgressProps } from './CircularProgressTypes'

const s = (key: string): string => styles[key] || key

/** Circular progress indicator. */
export const CircularProgress: React.FC<
  CircularProgressProps
> = ({
  value = 0,
  variant = 'indeterminate',
  size = 40,
  thickness = 4,
  color = 'primary',
  className = '',
  style,
  testId,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value))
  const viewBox = 48
  const radius = (viewBox - thickness) / 2
  const circ = 2 * Math.PI * radius
  const offset =
    variant === 'determinate'
      ? (((100 - clamped) / 100) * circ).toFixed(3)
      : (0.75 * circ).toFixed(3)

  const cls = [
    s('mat-mdc-progress-spinner'),
    styles.matProgress,
    variant === 'indeterminate'
      ? s('mdc-circular-progress--indeterminate')
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cls}
      role="progressbar"
      aria-valuenow={
        variant === 'determinate' ? clamped : undefined
      }
      aria-valuemin={0}
      aria-valuemax={100}
      data-testid={testId}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        ...style,
      }}
      {...props}
    >
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`}>
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeDasharray={circ.toFixed(3)}
          strokeDashoffset={offset}
          stroke="currentColor"
        />
      </svg>
    </div>
  )
}

export default CircularProgress
