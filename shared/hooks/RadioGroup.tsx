import React, { forwardRef, useId } from 'react'
import {
  RadioGroupContext,
  buildRadioChildren,
} from './RadioGroupContext'

/**
 * Props for RadioGroup component
 */
export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
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

/**
 * RadioGroup - Groups Radio buttons
 *
 * @example
 * ```tsx
 * <RadioGroup name="size" value={size}
 *   onChange={handleChange}>
 *   <Radio value="small" label="Small" />
 *   <Radio value="large" label="Large" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<
  HTMLDivElement, RadioGroupProps
>(
  (
    {
      children, name: nameProp,
      value, defaultValue, onChange,
      row = false, className = '', ...props
    },
    ref
  ) => {
    const generatedName = useId()
    const name = nameProp ?? generatedName

    const enhanced = buildRadioChildren(
      children, name,
      value, defaultValue, onChange
    )

    return (
      <RadioGroupContext.Provider
        value={{ name, value, onChange }}
      >
        <div
          ref={ref}
          role="radiogroup"
          className={
            `radio-group ` +
            `${row ? 'radio-group--row' : ''} ` +
            `${className}`
          }
          {...props}
        >
          {enhanced}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'
