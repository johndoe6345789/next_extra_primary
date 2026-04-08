/**
 * Feedback/status components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

export {
  CircularProgress, Skeleton,
} from './feedbackExtras'

/** Alert banner. */
export const Alert: React.FC<
  ComponentProps & {
    severity?: 'info' | 'success'
      | 'warning' | 'error'
  }
> = ({
  severity = 'info', className = '', children,
}) => {
  const c = {
    info: 'bg-blue-50 border-blue-200'
      + ' text-blue-800',
    success: 'bg-green-50 border-green-200'
      + ' text-green-800',
    warning: 'bg-yellow-50 border-yellow-200'
      + ' text-yellow-800',
    error: 'bg-red-50 border-red-200'
      + ' text-red-800',
  }
  return (
    <div className={
      `p-4 rounded border ${c[severity]}`
      + ` ${className}`
    }>
      {children}
    </div>
  )
}

interface ProgressProps extends ComponentProps {
  value?: number; max?: number
  variant?: 'determinate' | 'indeterminate'
  color?: 'primary' | 'secondary'
    | 'success' | 'error'
}

/** Linear progress bar. */
export const Progress: React.FC<
  ProgressProps
> = ({
  value = 0, max = 100,
  variant = 'determinate',
  color = 'primary', className = '',
}) => {
  const pct = Math.min(
    100, Math.max(0, (value / max) * 100),
  )
  const cc = {
    primary: 'bg-accent',
    secondary: 'bg-muted-foreground',
    success: 'bg-green-500',
    error: 'bg-red-500',
  }
  const anim = variant === 'indeterminate'
    ? 'animate-pulse' : ''
  return (
    <div className={
      'w-full h-2 bg-muted rounded-full'
      + ` overflow-hidden ${className}`
    }>
      <div
        className={
          `h-full ${cc[color]}`
          + ` transition-all duration-300 ${anim}`
        }
        style={{
          width: variant === 'determinate'
            ? `${pct}%` : '50%',
        }}
      />
    </div>
  )
}
