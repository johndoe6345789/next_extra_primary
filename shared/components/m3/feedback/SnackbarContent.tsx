'use client'

/**
 * SnackbarContent - the message + action panel
 * inside a Snackbar.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/mat-snackbar.module.scss'
import type { SnackbarContentProps } from './SnackbarTypes'

const s = (key: string): string => styles[key] || key

/** Get severity-based color class */
function getSeverityClass(
  severity?: string,
): string | undefined {
  if (!severity) return undefined
  const map: Record<string, string | undefined> = {
    success: styles.snackbarSuccess,
    error: styles.snackbarError,
    warning: styles.snackbarWarning,
    info: styles.snackbarInfo,
  }
  return map[severity]
}

/** Snackbar message panel with optional action. */
export const SnackbarContent: React.FC<
  SnackbarContentProps
> = ({ message, action, severity, className = '', ...props }) => {
  const cls = classNames(
    s('mat-mdc-simple-snack-bar'),
    getSeverityClass(severity),
    className,
  )

  return (
    <div className={cls} role="alert" {...props}>
      {message && (
        <div
          className={classNames(
            s('mdc-snackbar__label'),
            s('mat-mdc-snack-bar-label'),
          )}
        >
          {message}
        </div>
      )}
      {action && (
        <div className={s('mat-mdc-snack-bar-actions')}>
          {action}
        </div>
      )}
    </div>
  )
}
