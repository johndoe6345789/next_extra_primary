'use client';
import React, { forwardRef, useId } from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/form.module.scss'
import { InputProps, getSizeClass } from './InputTypes'
import { InputField } from './InputField'

export type { InputSize, InputProps } from './InputTypes'
export { getSizeClass } from './InputTypes'

/** Input component with label and error support */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    size, sm, md, lg, error, errorMessage, label, helperText,
    fullWidth, startAdornment, endAdornment, testId, className = '',
    id: idProp, 'aria-describedby': ariaDescribedBy, ...restProps
  } = props

  const generatedId = useId()
  const id = idProp ?? generatedId
  const helperId = `${id}-helper`
  const errorId = `${id}-error`

  const classes = classNames(styles.input,
    getSizeClass(props) && styles[getSizeClass(props).replace('input--', 'input')],
    error && styles.inputError, fullWidth && styles.inputFullWidth, className)

  const parts: string[] = []
  if (ariaDescribedBy) parts.push(ariaDescribedBy)
  if (error && errorMessage) parts.push(errorId)
  if (helperText && !error) parts.push(helperId)
  const describedBy = parts.length > 0 ? parts.join(' ') : undefined

  const inputEl = (
    <div className={classNames(styles.inputWrapper, fullWidth && styles.inputWrapperFullWidth)}>
      {startAdornment && <span className={classNames(styles.inputAdornment, styles.inputAdornmentStart)}>{startAdornment}</span>}
      <input ref={ref} id={id} className={classes} aria-invalid={error} aria-describedby={describedBy} data-testid={testId} {...restProps} />
      {endAdornment && <span className={classNames(styles.inputAdornment, styles.inputAdornmentEnd)}>{endAdornment}</span>}
    </div>
  )

  if (!label && !helperText && !errorMessage) return inputEl

  return (
    <InputField id={id} label={label} helperText={helperText} error={error}
      errorMessage={errorMessage} fullWidth={fullWidth} required={restProps.required}>
      {inputEl}
    </InputField>
  )
})

Input.displayName = 'Input'
