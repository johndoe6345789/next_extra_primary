import React from 'react'

/**
 * RadioGroup context value
 */
export interface RadioGroupContextValue {
  name?: string
  value?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

/**
 * Props for the RadioGroup component
 */
export interface RadioGroupProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  testId?: string
  children?: React.ReactNode
  /** Name attribute for all radio buttons */
  name?: string
  /** Currently selected value */
  value?: string
  /** Default value for uncontrolled usage */
  defaultValue?: string
  /** Called when selection changes */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
  /** Stack radio buttons horizontally */
  row?: boolean
}
