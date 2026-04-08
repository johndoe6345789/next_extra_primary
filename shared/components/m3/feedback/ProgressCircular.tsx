/**
 * CircularProgress (full-featured) - SVG-based
 * circular loading indicator with label support.
 */

import React from 'react'
import styles from '../../../scss/atoms/mat-progress.module.scss'
import type { CircularProgressProps } from './ProgressTypes'
import {
  DeterminateCircle,
  IndeterminateCircle,
} from './ProgressCircularDeterminate'

const s = (key: string): string => styles[key] || key

const colorMap: Record<string, string> = {
  primary: '', secondary: styles.colorSecondary,
  tertiary: styles.colorTertiary,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  error: styles.colorError,
  info: styles.colorInfo, inherit: styles.colorInherit,
}

/** Circular progress indicator. */
export const CircularProgress: React.FC<
  CircularProgressProps
> = ({
  value = 0, variant = 'indeterminate',
  size = 40, thickness = 4, color = 'primary',
  showLabel = false, className = '', style,
  testId, ...props
}) => {
  const cv = Math.min(100, Math.max(0, value))
  const vb = 48
  const r = (vb - thickness) / 2
  const circ = 2 * Math.PI * r
  const da = circ.toFixed(3)
  const doff = variant === 'determinate'
    ? (((100 - cv) / 100) * circ).toFixed(3)
    : (0.75 * circ).toFixed(3)

  const cls = [
    s('mat-mdc-progress-spinner'),
    styles.matProgress,
    colorMap[color] || '',
    variant === 'indeterminate'
      ? s('mdc-circular-progress--indeterminate') : '',
    showLabel ? styles.circularWithLabel : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cls} data-testid={testId}
      role="progressbar"
      aria-valuenow={variant === 'determinate' ? cv : undefined}
      aria-valuemin={0} aria-valuemax={100}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        ...style,
      }}
      {...props}
    >
      {variant === 'determinate' ? (
        <DeterminateCircle
          viewBox={vb} radius={r}
          thickness={thickness}
          dashArray={da} dashOffset={doff}
        />
      ) : (
        <IndeterminateCircle
          viewBox={vb} radius={r}
          thickness={thickness}
          dashArray={da} dashOffset={doff}
        />
      )}
      {showLabel && variant === 'determinate' && (
        <span className={styles.circularLabel}>
          {Math.round(cv)}%
        </span>
      )}
    </div>
  )
}
