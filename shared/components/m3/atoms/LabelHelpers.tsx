import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/label.module.scss'

export { CounterText } from './CounterText'
export type { CounterTextProps }
  from './CounterText'

export interface FieldLabelProps
  extends React.LabelHTMLAttributes<
    HTMLLabelElement
  > {
  children?: React.ReactNode
  /** Show error styling */
  error?: boolean
  /** Show focused styling */
  focused?: boolean
  /** Show required asterisk indicator */
  required?: boolean
}

/** Label for form fields with error/focus. */
export const FieldLabel: React.FC<
  FieldLabelProps
> = ({
  children, className,
  error = false, focused = false,
  required = false, ...props
}) => {
  const labelClassName = classNames(
    styles.fieldLabel,
    error && styles.fieldLabelError,
    focused && !error &&
      styles.fieldLabelFocused,
    required && styles.labelRequired,
    className
  )
  return (
    <label className={labelClassName} {...props}>
      {children}
    </label>
  )
}

export interface HelperTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  /** Show error styling */
  error?: boolean
}

/** Helper text below form fields. */
export const HelperText: React.FC<
  HelperTextProps
> = ({
  children, className,
  error = false, ...props
}) => {
  const helperClassName = classNames(
    styles.helperText,
    error && styles.helperTextError,
    className
  )
  return (
    <span className={helperClassName} {...props}>
      {children}
    </span>
  )
}
