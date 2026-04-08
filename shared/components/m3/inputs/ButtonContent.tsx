'use client';
import React from 'react'
import styles from '../../../scss/atoms/mat-button.module.scss'
import { s } from './buttonHelpers'

/**
 * Props for ButtonContent sub-component
 */
interface ButtonContentProps {
  loading?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Internal content structure for Button
 * (touch target, ripple, icons, label)
 */
export function ButtonContent({
  loading,
  startIcon,
  endIcon,
  children,
}: ButtonContentProps) {
  return (
    <>
      <span className={s('mat-mdc-button-touch-target')} />
      <span className={s('mat-mdc-button-ripple')} />
      <span className={s('mat-mdc-button-persistent-ripple')} />
      <span className={s('mat-focus-indicator')} />
      {loading && (
        <span
          className={`${s('mat-icon')} ${styles.spinner}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{
              width: '1.125rem',
              height: '1.125rem',
              animation:
                'mat-button-spin 1s linear infinite',
            }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      {startIcon && (
        <span className={s('mat-icon')} aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className={s('mdc-button__label')}>
        {children}
      </span>
      {endIcon && (
        <span className={s('mat-icon')} aria-hidden="true">
          {endIcon}
        </span>
      )}
    </>
  )
}
