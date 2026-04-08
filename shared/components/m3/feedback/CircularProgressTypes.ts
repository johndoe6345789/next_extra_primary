/**
 * Type definitions for the standalone
 * CircularProgress component.
 */
import type React from 'react'

/** Props for the CircularProgress component */
export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) for determinate */
  value?: number
  /** Visual style variant */
  variant?: 'determinate' | 'indeterminate'
  /** Diameter in px or CSS string */
  size?: number | string
  /** Stroke thickness */
  thickness?: number
  /** Color theme */
  color?: 'primary' | 'secondary' | 'inherit'
  /** Test ID for automated testing */
  testId?: string
}
