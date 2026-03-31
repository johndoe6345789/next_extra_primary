'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-progress.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for the LinearProgress component */
export interface LinearProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value?: number
  /** Visual style variant */
  variant?: 'determinate' | 'indeterminate' | 'buffer'
  /** Color theme */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'inherit'
  /** Test ID for automated testing */
  testId?: string
}

/**
 * LinearProgress - horizontal loading bar.
 * Supports determinate and indeterminate modes.
 */
export const LinearProgress: React.FC<LinearProgressProps> = ({
  value = 0,
  variant = 'indeterminate',
  color = 'primary',
  className = '',
  testId,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value))

  const classes = [
    s('mat-mdc-progress-bar'),
    s('mdc-linear-progress'),
    styles.matProgress,
    variant === 'indeterminate'
      ? s('mdc-linear-progress--indeterminate')
      : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      role="progressbar"
      aria-valuenow={
        variant === 'determinate' ? clamped : undefined
      }
      aria-valuemin={0}
      aria-valuemax={100}
      data-testid={testId}
      {...props}
    >
      <div className={s('mdc-linear-progress__buffer')}>
        <div className={s('mdc-linear-progress__buffer-bar')} />
      </div>
      <div
        className={`${s('mdc-linear-progress__bar')} ${s('mdc-linear-progress__primary-bar')}`}
        style={
          variant === 'determinate'
            ? { transform: `scaleX(${clamped / 100})` }
            : undefined
        }
      >
        <span
          className={s('mdc-linear-progress__bar-inner')}
        />
      </div>
      <div
        className={`${s('mdc-linear-progress__bar')} ${s('mdc-linear-progress__secondary-bar')}`}
      >
        <span
          className={s('mdc-linear-progress__bar-inner')}
        />
      </div>
    </div>
  )
}

export default LinearProgress
