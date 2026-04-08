'use client'
/** ToastItem - single toast notification row. */

import React from 'react'
import styles from '../../../scss/atoms/mat-toast.module.scss'
import type { ToastEntry, ToastSeverity } from './ToastStore'

const ICONS: Record<ToastSeverity, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

/** Props for a single toast item */
export interface ToastItemProps {
  entry: ToastEntry
  onDismiss: () => void
}

/** Renders a severity-colored toast with icon. */
export function ToastItem({
  entry,
  onDismiss,
}: ToastItemProps) {
  const isError = entry.severity === 'error'
  return (
    <div
      className={`${styles.toast} ${styles[entry.severity]}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span
        className={`material-symbols-outlined ${styles.icon}`}
        aria-hidden="true"
      >
        {ICONS[entry.severity]}
      </span>
      <span className={styles.message}>
        {entry.message}
      </span>
      <button
        type="button"
        className={styles.dismiss}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
        >
          close
        </span>
      </button>
    </div>
  )
}
