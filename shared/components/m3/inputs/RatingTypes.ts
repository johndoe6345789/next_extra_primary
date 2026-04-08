import React from 'react'

/**
 * Props for the Rating component
 */
export interface RatingProps
  extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    'onChange'
  > {
  testId?: string
  value?: number
  onChange?: (
    event: React.SyntheticEvent | null,
    value: number
  ) => void
  max?: number
  precision?: number
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  readOnly?: boolean
  name?: string
  emptyIcon?: React.ReactNode
  icon?: React.ReactNode
  highlightSelectedOnly?: boolean
}
