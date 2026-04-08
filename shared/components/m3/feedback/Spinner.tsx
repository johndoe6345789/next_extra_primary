/**
 * Spinner - CSS-based loading indicator.
 * Re-exports CircularProgress and SpinnerOverlay.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/spinner.module.scss'
import type {
  SpinnerProps,
  SpinnerSize,
  SpinnerColor,
} from './SpinnerTypes'

export type {
  SpinnerProps,
  SpinnerSize,
  SpinnerColor,
  SpinnerCircularProgressProps,
  SpinnerOverlayProps,
} from './SpinnerTypes'

export {
  CircularProgress,
  SpinnerOverlay,
} from './SpinnerParts'

const sizeClassMap: Record<SpinnerSize, string> = {
  xs: styles.spinnerXs,
  sm: styles.spinnerSm,
  md: styles.spinnerMd,
  lg: styles.spinnerLg,
  xl: styles.spinnerXl,
}

const colorClassMap: Record<
  SpinnerColor, string | undefined
> = {
  primary: undefined,
  secondary: styles.spinnerSecondary,
  tertiary: styles.spinnerTertiary,
  error: styles.spinnerError,
  onPrimary: styles.spinnerOnPrimary,
  onSurface: styles.spinnerOnSurface,
}

/** CSS-based loading spinner. */
export const Spinner: React.FC<SpinnerProps> = ({
  size,
  color = 'primary',
  sm,
  lg,
  className,
  testId,
  ...props
}) => {
  const resolved = size ?? (
    sm ? 'sm' : lg ? 'lg' : 'md'
  )

  return (
    <div
      className={classNames(
        styles.spinner,
        sizeClassMap[resolved],
        colorClassMap[color],
        className,
      )}
      data-testid={testId}
      role="status"
      aria-label="Loading"
      {...props}
    />
  )
}
