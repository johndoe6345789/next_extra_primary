import type React from 'react'

/** Props for ToggleButton component */
export interface ToggleButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<
      HTMLButtonElement
    >,
    'value'
  > {
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
