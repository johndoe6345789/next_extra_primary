'use client';
import React, { forwardRef } from 'react'
import { classNames } from '../utils/classNames'
import { InputBaseProps } from './InputBaseTypes'

export type { ButtonBaseProps, InputBaseProps, FilledInputProps, OutlinedInputProps } from './InputBaseTypes'
export { ButtonBase } from './ButtonBase'
export { FilledInput, OutlinedInput } from './InputBaseVariants'

/** InputBase - base input element with adornments */
export const InputBase = forwardRef<HTMLDivElement, InputBaseProps>(function InputBase(
  {
    className, testId, disabled = false, error = false, fullWidth = false,
    multiline = false, rows, minRows: _minRows, maxRows: _maxRows,
    startAdornment, endAdornment,
    inputComponent: InputComp = 'input', inputProps = {}, inputRef,
    value, defaultValue, onChange, onFocus, onBlur,
    placeholder, readOnly = false, required = false, type = 'text', ...props
  }, ref
) {
  const input = multiline ? (
    <textarea
      ref={inputRef as React.Ref<HTMLTextAreaElement>} className="m3-input-base-input"
      disabled={disabled} readOnly={readOnly} required={required}
      value={value} defaultValue={defaultValue}
      onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
      onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
      onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
      placeholder={placeholder} rows={rows}
      {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
    />
  ) : (
    <InputComp
      ref={inputRef as React.Ref<HTMLInputElement>} className="m3-input-base-input"
      type={type} disabled={disabled} readOnly={readOnly} required={required}
      value={value} defaultValue={defaultValue}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
      onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
      placeholder={placeholder}
      {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  )

  return (
    <div
      ref={ref}
      className={classNames('m3-input-base', className, {
        'm3-input-base-disabled': disabled, 'm3-input-base-error': error,
        'm3-input-base-fullwidth': fullWidth, 'm3-input-base-multiline': multiline,
      })}
      data-testid={testId} {...props}
    >
      {startAdornment && <span className="m3-input-base-adornment-start">{startAdornment}</span>}
      {input}
      {endAdornment && <span className="m3-input-base-adornment-end">{endAdornment}</span>}
    </div>
  )
})

export default InputBase
