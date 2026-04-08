import type React from 'react'
import styles
  from '../../../scss/atoms/label.module.scss'

/** Size variants for the Label component. */
export type LabelSize = 'sm' | 'md' | 'lg'

/** Color variants for the Label component. */
export type LabelColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info'
  | 'onSurface'

/** Props for the Label component. */
export interface LabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  /** Size variant */
  size?: LabelSize
  /** Color variant */
  color?: LabelColor
  /** Transform text to uppercase */
  uppercase?: boolean
  /** Show required asterisk indicator */
  required?: boolean
  /** Enable inline-flex layout for icons */
  withIcon?: boolean
  /** Associate label with form element */
  htmlFor?: string
  /** Test ID for automated testing */
  testId?: string
}

/** Maps size variants to CSS module classes. */
export const sizeClassMap: Record<
  LabelSize,
  string | undefined
> = {
  sm: styles.labelSm,
  md: undefined,
  lg: styles.labelLg,
}

/** Maps color variants to CSS module classes. */
export const colorClassMap: Record<
  LabelColor,
  string | undefined
> = {
  primary: styles.labelPrimary,
  secondary: styles.labelSecondary,
  error: styles.labelError,
  success: styles.labelSuccess,
  warning: styles.labelWarning,
  info: styles.labelInfo,
  onSurface: styles.labelOnSurface,
}
