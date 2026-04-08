import React from 'react'

/**
 * Mark definition for slider track
 */
export interface SliderMark {
  value: number
  label?: React.ReactNode
}

/**
 * Props for the Slider component
 */
export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'onChange'
    | 'value'
    | 'size'
    | 'defaultValue'
  > {
  /** Current value (controlled) */
  value?: number | number[]
  /** Default value (uncontrolled) */
  defaultValue?: number | number[]
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Marks to display on the track */
  marks?: boolean | SliderMark[]
  /** When value label is displayed */
  valueLabelDisplay?: 'auto' | 'on' | 'off'
  /** Format function for value label */
  valueLabelFormat?: (
    value: number
  ) => React.ReactNode
  /** Track display mode */
  track?: 'normal' | 'inverted' | false
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Color variant */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
  /** Size variant */
  size?: 'small' | 'medium'
  /** Disable the slider */
  disabled?: boolean
  /** Change handler */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => void
  /** Change committed handler (on mouse up) */
  onChangeCommitted?: (
    event: React.SyntheticEvent,
    value: number
  ) => void
  /** Radix-style value change handler */
  onValueChange?: (value: number[]) => void
  testId?: string
  /** Accessible label */
  'aria-label'?: string
  /** ID of element that labels this slider */
  'aria-labelledby'?: string
}
