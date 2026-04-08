import React from 'react'

/**
 * Select event type compatible with MUI
 */
export interface SelectChangeEvent<T = string> {
  target: {
    value: T
    name?: string
  }
}

/**
 * Props for Select component (MUI-compatible)
 */
export interface SelectProps<T = string>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
  > {
  /** Currently selected value(s) */
  value?: T | T[]
  /** Default value for uncontrolled mode */
  defaultValue?: T | T[]
  /** Enable multiple selection */
  multiple?: boolean
  /** Placeholder when no value is selected */
  displayEmpty?: boolean
  /** Custom render for selected value(s) */
  renderValue?: (value: T | T[]) => React.ReactNode
  /** onChange callback */
  onChange?: (
    event: SelectChangeEvent<T | T[]>
  ) => void
  /** onBlur callback */
  onBlur?: (
    event: React.FocusEvent<HTMLDivElement>
  ) => void
  /** onFocus callback */
  onFocus?: (
    event: React.FocusEvent<HTMLDivElement>
  ) => void
  /** Input name for forms */
  name?: string
  /** Whether the select is disabled */
  disabled?: boolean
  /** Whether the select is required */
  required?: boolean
  /** Whether there's an error */
  error?: boolean
  /** Whether the select takes full width */
  fullWidth?: boolean
  /** Size variant */
  size?: 'small' | 'medium'
  /** Visual variant */
  variant?: 'standard' | 'outlined' | 'filled'
  /** Label for the select */
  label?: string
  /** Auto width based on content */
  autoWidth?: boolean
  /** Menu items */
  children?: React.ReactNode
  /** MUI sx prop for styling compatibility */
  sx?: Record<string, unknown>
  /** Native mode - use native HTML select */
  native?: boolean
  /** Menu props */
  MenuProps?: Record<string, unknown>
  /** Icon component to use */
  IconComponent?: React.ComponentType<{
    className?: string
  }>
  /** Input props */
  inputProps?: Record<string, unknown>
  /** Test ID for testing frameworks */
  testId?: string
}
