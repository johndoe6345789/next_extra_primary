/**
 * Type definitions for the full-featured Progress
 * components (used by Progress.tsx barrel).
 */
import type React from 'react'

/** Props for LinearProgress (full-featured version) */
export interface LinearProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  valueBuffer?: number
  variant?:
    | 'determinate'
    | 'indeterminate'
    | 'buffer'
    | 'query'
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
  /** @deprecated Use variant="indeterminate" */
  indeterminate?: boolean
  showLabel?: boolean
  size?: 'thin' | 'default' | 'thick'
  testId?: string
}

/** Props for CircularProgress (full-featured) */
export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  variant?: 'determinate' | 'indeterminate'
  size?: number | string
  thickness?: number
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'inherit'
  showLabel?: boolean
  testId?: string
}
