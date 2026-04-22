'use client';
import React, { forwardRef, useId } from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/form.module.scss'
import { FormLabel } from './FormLabel'
import { FormHelperText } from './FormHelperText'
import { Input } from './Input'
import { Select } from './Select'
import { useAccessible } from '../../../hooks/useAccessible'
import { sxToStyle } from '../utils/sx'
import { TextFieldProps } from './TextFieldTypes'
import { TextFieldMultiline } from './TextFieldMultiline'

export type { TextFieldProps } from './TextFieldTypes'

/** TextField - combined label/input/helper field */
export const TextField = forwardRef<HTMLInputElement | HTMLDivElement, TextFieldProps>(
  ({ label, helperText, error, className = '', id: providedId, select, children,
     size, testId: customTestId, sx, style, multiline, rows, minRows, inputProps,
     FormHelperTextProps: _fhtp, ...props }, ref) => {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const htId = `${id}-helper-text`
    const inputSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : undefined
    const accessible = useAccessible({
      feature: 'form', component: select ? 'select' : 'input',
      identifier: customTestId || String(label)?.substring(0, 20),
      ariaDescribedBy: helperText ? htId : undefined,
    })
    const tid = customTestId ?? accessible['data-testid']

    return (
      <div className={classNames(styles.formGroup, className)} style={{ ...sxToStyle(sx), ...style }}>
        {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
        {select ? (
          <Select ref={ref as React.Ref<HTMLDivElement>} id={id} error={error}
            className={classNames(styles.inputFullWidth)} data-testid={tid} aria-invalid={error}
            aria-describedby={helperText ? htId : undefined}
            value={props.value as string | string[] | undefined}
            onChange={props.onChange as unknown as ((e: { target: { value: string | string[]; name?: string } }) => void) | undefined}
            name={props.name} disabled={props.disabled} required={props.required}>
            {children}
          </Select>
        ) : multiline ? (
          <TextFieldMultiline innerRef={ref as React.Ref<HTMLTextAreaElement>} id={id} error={error} rows={rows ?? minRows}
            testId={tid} helperTextId={helperText ? htId : undefined} value={props.value as string}
            onChange={props.onChange as never} name={props.name} disabled={props.disabled}
            required={props.required} placeholder={props.placeholder}
            inputProps={inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />
        ) : (
          <Input ref={ref as React.Ref<HTMLInputElement>} id={id} error={error} data-testid={tid}
            aria-invalid={error} aria-describedby={helperText ? htId : undefined}
            {...props} {...inputProps} size={inputSize} />
        )}
        {helperText && <FormHelperText error={error} id={htId} role="status">{helperText}</FormHelperText>}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
export default TextField
