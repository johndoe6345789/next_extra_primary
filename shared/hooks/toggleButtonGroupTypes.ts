import React from 'react'

/**
 * Context value for toggle button group state
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

/** Props for ToggleButtonGroup component */
export interface ToggleButtonGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue'
  > {
  children?: React.ReactNode
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onChange?: (
    event: React.MouseEvent,
    value: string | string[] | null
  ) => void
  exclusive?: boolean
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
  color?: 'primary' | 'secondary' | 'standard'
}
