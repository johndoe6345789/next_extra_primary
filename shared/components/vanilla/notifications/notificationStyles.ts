import type React from 'react'
import type {
  NotificationType,
  NotificationPosition,
} from './types'

/** Color scheme per notification type. */
export const typeStyles: Record<
  NotificationType,
  { bg: string; border: string; text: string }
> = {
  success: {
    bg: 'rgba(46, 125, 50, 0.1)',
    border: 'var(--color-success, #2e7d32)',
    text: 'var(--color-success, #2e7d32)',
  },
  error: {
    bg: 'rgba(211, 47, 47, 0.1)',
    border: 'var(--color-error, #d32f2f)',
    text: 'var(--color-error, #d32f2f)',
  },
  warning: {
    bg: 'rgba(245, 127, 0, 0.1)',
    border: 'var(--color-warning, #f57f00)',
    text: 'var(--color-warning, #f57f00)',
  },
  info: {
    bg: 'rgba(2, 136, 209, 0.1)',
    border: 'var(--color-info, #0288d1)',
    text: 'var(--color-info, #0288d1)',
  },
}

/** CSS position per notification placement. */
export const positionStyles: Record<
  NotificationPosition,
  React.CSSProperties
> = {
  'top-left': { top: 16, left: 16 },
  'top-center': {
    top: 16, left: '50%',
    transform: 'translateX(-50%)',
  },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-center': {
    bottom: 16, left: '50%',
    transform: 'translateX(-50%)',
  },
  'bottom-right': { bottom: 16, right: 16 },
}
