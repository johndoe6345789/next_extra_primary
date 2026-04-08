/**
 * Type definitions for Spinner components.
 */
import type React from 'react'

/** Spinner size variants */
export type SpinnerSize =
  | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Spinner color variants */
export type SpinnerColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'onPrimary'
  | 'onSurface'

/** Props for the Spinner component */
export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  color?: SpinnerColor
  /** @deprecated Use size="sm" */
  sm?: boolean
  /** @deprecated Use size="lg" */
  lg?: boolean
  testId?: string
}

/** Props for SVG CircularProgress */
export interface SpinnerCircularProgressProps
  extends React.SVGAttributes<SVGSVGElement> {
  size?: SpinnerSize
  strokeWidth?: number
}

/** Props for the SpinnerOverlay */
export interface SpinnerOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
  color?: SpinnerColor
  text?: string
}
