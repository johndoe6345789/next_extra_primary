'use client'

import React, { forwardRef } from 'react'
import { useFormControl } from './FormControl'
import { InputLabelProps } from './InputLabelTypes'

export type { InputLabelProps }
  from './InputLabelTypes'

/**
 * InputLabel - label for form inputs
 *
 * @example
 * ```tsx
 * <FormControl>
 *   <InputLabel>Email</InputLabel>
 *   <Select value={v} onChange={h}>
 *     <MenuItem value="one">One</MenuItem>
 *   </Select>
 * </FormControl>
 * ```
 */
export const InputLabel = forwardRef<
  HTMLLabelElement,
  InputLabelProps
>(
  (
    {
      children,
      shrink = false,
      required: requiredProp,
      disabled: disabledProp,
      error: errorProp,
      variant = 'outlined',
      size = 'medium',
      testId,
      className = '',
      sx,
      ...props
    },
    ref
  ) => {
    const formControl = useFormControl()

    const required =
      requiredProp ?? formControl.required
    const disabled =
      disabledProp ?? formControl.disabled
    const error =
      errorProp ?? formControl.error
    const id = formControl.id

    return (
      <label
        ref={ref}
        htmlFor={id}
        className={`input-label input-label--${variant} input-label--${size} ${shrink ? 'input-label--shrink' : ''} ${required ? 'input-label--required' : ''} ${disabled ? 'input-label--disabled' : ''} ${error ? 'input-label--error' : ''} ${className}`
          .trim()
          .replace(/\s+/g, ' ')}
        data-testid={testId}
        {...props}
      >
        {children}
        {required && (
          <span className="input-label__asterisk">
            &nbsp;*
          </span>
        )}
      </label>
    )
  }
)

InputLabel.displayName = 'InputLabel'
