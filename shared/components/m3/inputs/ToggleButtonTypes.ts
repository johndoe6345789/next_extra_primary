import React from 'react'

/**
 * Context for managing toggle button group state
 */
export interface ToggleButtonGroupContextValue {
  value: string | string[] | null
  exclusive: boolean
  disabled: boolean
  size: 'small' | 'medium' | 'large'
  onChange: (
    event: React.MouseEvent,
    value: string
  ) => void
}

/**
 * Props for individual ToggleButton
 */
export interface ToggleButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value'
  > {
  testId?: string
  children?: React.ReactNode
  /** Whether this button is selected */
  selected?: boolean
  /** Value for this button in a group */
  value?: string
  /** Button size */
  size?: 'small' | 'medium' | 'large'
  /** Full width button */
  fullWidth?: boolean
}

/**
 * Props for ToggleButtonGroup
 */
export interface ToggleButtonGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
  > {
  children?: React.ReactNode
  /** Current selected value(s) */
  value?: string | string[] | null
  /** Default value(s) if uncontrolled */
  defaultValue?: string | string[] | null
  /** Called when selection changes */
  onChange?: (
    event: React.MouseEvent,
    value: string | string[] | null
  ) => void
  /** Only allow one selection at a time */
  exclusive?: boolean
  /** Disable all buttons */
  disabled?: boolean
  /** Button size for all children */
  size?: 'small' | 'medium' | 'large'
  /** Stack buttons vertically */
  orientation?: 'horizontal' | 'vertical'
  /** Full width group */
  fullWidth?: boolean
  /** Color theme */
  color?: 'primary' | 'secondary' | 'standard'
}
