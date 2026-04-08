'use client';
import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/form.module.scss'

/**
 * Props for InputField wrapper
 */
interface InputFieldProps {
  id: string
  label?: string
  helperText?: string
  error?: boolean
  errorMessage?: string
  fullWidth?: boolean
  required?: boolean
  children: React.ReactNode
}

/**
 * InputField - wrapper rendering label, helper,
 * and error text around an input element.
 */
export function InputField({
  id,
  label,
  helperText,
  error,
  errorMessage,
  fullWidth,
  required,
  children,
}: InputFieldProps) {
  const helperId = `${id}-helper`
  const errorId = `${id}-error`

  return (
    <div
      className={classNames(
        styles.inputField,
        fullWidth && styles.inputFieldFullWidth
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className={styles.inputLabel}
        >
          {label}
          {required && (
            <span
              className={styles.inputRequired}
              aria-hidden="true"
            >
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && errorMessage && (
        <span
          id={errorId}
          className={styles.inputErrorMessage}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
      {!error && helperText && (
        <span
          id={helperId}
          className={styles.inputHelperText}
        >
          {helperText}
        </span>
      )}
    </div>
  )
}
