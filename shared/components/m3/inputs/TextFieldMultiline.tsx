'use client';
import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/form.module.scss'

/**
 * Props for TextFieldMultiline sub-component
 */
interface TextFieldMultilineProps {
  innerRef: React.Ref<HTMLTextAreaElement>
  id: string
  error?: boolean
  rows?: number
  testId?: string
  helperTextId?: string
  value?: string
  onChange?: React.ChangeEventHandler<
    HTMLTextAreaElement
  >
  name?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  inputProps?: React.TextareaHTMLAttributes<
    HTMLTextAreaElement
  >
}

/**
 * Multiline textarea variant for TextField
 */
export function TextFieldMultiline({
  innerRef,
  id,
  error,
  rows,
  testId,
  helperTextId,
  value,
  onChange,
  name,
  disabled,
  required,
  placeholder,
  inputProps,
}: TextFieldMultilineProps) {
  return (
    <textarea
      ref={innerRef}
      id={id}
      className={classNames(
        styles.input,
        styles.inputFullWidth,
        error && styles.inputError
      )}
      rows={rows ?? 4}
      data-testid={testId}
      aria-invalid={error || undefined}
      aria-describedby={helperTextId}
      value={value}
      onChange={onChange}
      name={name}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      {...inputProps}
    />
  )
}
