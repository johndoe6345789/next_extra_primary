import type { StatusVariant, BackendStatusType } from './types'

/** Color scheme per status variant. */
export const variantStyles: Record<
  StatusVariant,
  { bg: string; border: string; text: string; dot: string }
> = {
  success: {
    bg: 'rgba(46, 125, 50, 0.1)',
    border: 'rgba(46, 125, 50, 0.3)',
    text: 'var(--color-success, #2e7d32)',
    dot: 'var(--color-success, #2e7d32)',
  },
  error: {
    bg: 'rgba(211, 47, 47, 0.1)',
    border: 'rgba(211, 47, 47, 0.3)',
    text: 'var(--color-error, #d32f2f)',
    dot: 'var(--color-error, #d32f2f)',
  },
  warning: {
    bg: 'rgba(245, 127, 0, 0.1)',
    border: 'rgba(245, 127, 0, 0.3)',
    text: 'var(--color-warning, #f57f00)',
    dot: 'var(--color-warning, #f57f00)',
  },
  info: {
    bg: 'rgba(2, 136, 209, 0.1)',
    border: 'rgba(2, 136, 209, 0.3)',
    text: 'var(--color-info, #0288d1)',
    dot: 'var(--color-info, #0288d1)',
  },
  neutral: {
    bg: 'rgba(128, 128, 128, 0.1)',
    border: 'rgba(128, 128, 128, 0.3)',
    text: 'var(--color-muted, #666)',
    dot: 'var(--color-muted, #666)',
  },
}

/** Map backend status to variant. */
export const statusToVariant: Record<
  BackendStatusType, StatusVariant
> = {
  connected: 'success',
  disconnected: 'neutral',
  connecting: 'info',
  error: 'error',
}
