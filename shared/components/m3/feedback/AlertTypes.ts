/**
 * Type definitions for Alert components.
 */
import type React from 'react'

/** Alert severity levels */
export type AlertSeverity =
  | 'error'
  | 'warning'
  | 'info'
  | 'success'

/** Alert visual variants */
export type AlertVariant =
  | 'standard'
  | 'filled'
  | 'outlined'

/** Props for the Alert component */
export interface AlertProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'title'
  > {
  children?: React.ReactNode
  title?: React.ReactNode
  severity?: AlertSeverity
  icon?: React.ReactNode | false
  action?: React.ReactNode
  variant?: AlertVariant
  onClose?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void
  sx?: Record<string, unknown>
  testId?: string
}

/** Props for AlertTitle */
export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Props for AlertDescription */
export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}
