/**
 * SpinnerOverlay and SVG CircularProgress
 * sub-components for the Spinner module.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/spinner.module.scss'
import { Spinner } from './Spinner'
import type {
  SpinnerSize,
  SpinnerCircularProgressProps,
  SpinnerOverlayProps,
} from './SpinnerTypes'

const svgSizeMap: Record<SpinnerSize, number> = {
  xs: 16, sm: 24, md: 40, lg: 56, xl: 72,
}

/** SVG-based circular progress with M3 animation. */
export const CircularProgress: React.FC<
  SpinnerCircularProgressProps
> = ({ size = 'md', strokeWidth = 3, className, ...props }) => {
  const dim = svgSizeMap[size]
  const r = (dim - strokeWidth) / 2
  const circ = 2 * Math.PI * r

  return (
    <svg
      className={classNames(
        styles.circularProgress,
        className,
      )}
      width={dim}
      height={dim}
      viewBox={`0 0 ${dim} ${dim}`}
      {...props}
    >
      <circle
        className={styles.circularProgressCircle}
        cx={dim / 2}
        cy={dim / 2}
        r={r}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circ}
      />
    </svg>
  )
}

/** Full-screen or container overlay with spinner. */
export const SpinnerOverlay: React.FC<
  SpinnerOverlayProps
> = ({
  size = 'lg',
  color = 'primary',
  text,
  className,
  ...props
}) => (
  <div
    className={classNames(
      styles.spinnerOverlay,
      className,
    )}
    {...props}
  >
    {text ? (
      <div className={styles.spinnerText}>
        <Spinner size={size} color={color} />
        <span>{text}</span>
      </div>
    ) : (
      <Spinner size={size} color={color} />
    )}
  </div>
)
