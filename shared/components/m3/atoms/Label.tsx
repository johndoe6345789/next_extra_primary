import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/label.module.scss'
import {
  sizeClassMap, colorClassMap,
} from './labelTypes'
import type { LabelProps } from './labelTypes'

export type {
  LabelSize, LabelColor, LabelProps,
} from './labelTypes'

/** Styled text label with size/color variants. */
export const Label: React.FC<LabelProps> = ({
  children,
  className,
  size = 'md',
  color,
  uppercase = false,
  required = false,
  withIcon = false,
  testId,
  ...props
}) => {
  const labelClassName = classNames(
    styles.label,
    sizeClassMap[size],
    color && colorClassMap[color],
    uppercase && styles.labelUppercase,
    required && styles.labelRequired,
    withIcon && styles.labelWithIcon,
    className
  )

  return (
    <span
      className={labelClassName}
      data-testid={testId}
      {...props}
    >
      {children}
    </span>
  )
}

// Re-export helpers from LabelHelpers
export {
  FieldLabel,
  type FieldLabelProps,
  HelperText,
  type HelperTextProps,
  CounterText,
  type CounterTextProps,
} from './LabelHelpers'
