import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/label.module.scss'

export interface CounterTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  /** Current character count */
  count?: number
  /** Maximum character limit */
  maxLength?: number
  /** Show error styling */
  error?: boolean
}

/** Character counter text for form fields. */
export const CounterText: React.FC<
  CounterTextProps
> = ({
  children, className, count,
  maxLength, error = false, ...props
}) => {
  const isOver =
    count !== undefined &&
    maxLength !== undefined &&
    count > maxLength
  const counterClassName = classNames(
    styles.counterText,
    (error || isOver) &&
      styles.counterTextError,
    className
  )
  const content =
    count !== undefined &&
    maxLength !== undefined
      ? `${count}/${maxLength}`
      : children

  return (
    <span
      className={counterClassName}
      {...props}
    >
      {content}
    </span>
  )
}
