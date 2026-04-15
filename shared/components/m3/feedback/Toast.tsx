'use client'
/** Toaster component and toast imperative API. */

import React, { useSyncExternalStore } from 'react'
import styles from '../../../scss/atoms/mat-toast.module.scss'
import {
  toast, subscribe, getSnapshot, remove,
  type ToastEntry,
} from './ToastStore'
import { ToastItem } from './ToastItem'

export { toast }

/** Props for the Toaster container */
export interface ToasterProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  testId?: string
}

/** Place once near root to render toast stack. */
export function Toaster({
  position = 'bottom-right',
  testId,
}: ToasterProps) {
  const toasts = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  )

  if (toasts.length === 0) return null

  const posClass = position.replace(/-/g, '_')

  return (
    <div
      className={`${styles.container} ${styles[posClass]}`}
      data-testid={testId}
      role="alert"
      aria-live="assertive"
      aria-label="Notifications"
    >
      {toasts.map((entry) => (
        <ToastItem
          key={entry.id}
          entry={entry}
          onDismiss={() => remove(entry.id)}
        />
      ))}
    </div>
  )
}
