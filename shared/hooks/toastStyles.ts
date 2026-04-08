/**
 * Toast severity color maps and position styles
 */

import type React from 'react'
import type { ToastSeverity } from './toastTypes'

/** Color mapping for toast severities */
export const severityColors: Record<
  ToastSeverity,
  { bg: string; border: string; text: string }
> = {
  success: {
    bg: '#d4edda',
    border: '#c3e6cb',
    text: '#155724',
  },
  error: {
    bg: '#f8d7da',
    border: '#f5c6cb',
    text: '#721c24',
  },
  warning: {
    bg: '#fff3cd',
    border: '#ffeeba',
    text: '#856404',
  },
  info: {
    bg: '#d1ecf1',
    border: '#bee5eb',
    text: '#0c5460',
  },
}

/** Position styles by anchor origin key */
export const positionStyles: Record<
  string,
  React.CSSProperties
> = {
  'top-left': { top: 16, left: 16 },
  'top-center': {
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-center': {
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'bottom-right': { bottom: 16, right: 16 },
}
