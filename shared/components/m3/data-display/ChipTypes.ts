import React from 'react'

/**
 * Props for the Chip component
 */
export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Chip content (FakeMUI native) */
  children?: React.ReactNode
  /** Chip label text (MUI-compatible alias) */
  label?: React.ReactNode
  /** Icon displayed before the label */
  icon?: React.ReactNode
  /** Delete icon handler */
  onDelete?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void
  /** Make chip clickable */
  clickable?: boolean
  /** Size variant */
  size?: 'small' | 'medium'
  /** @deprecated Use size="small" instead */
  sm?: boolean
  /** Color variant (MUI-style) */
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
  /** @deprecated Use color="success" */
  success?: boolean
  /** @deprecated Use color="error" */
  error?: boolean
  /** @deprecated Use color="warning" */
  warning?: boolean
  /** @deprecated Use color="info" */
  info?: boolean
  /** Outlined variant */
  variant?: 'filled' | 'outlined'
  /** @deprecated Use variant="outlined" */
  outline?: boolean
  /** MUI sx prop */
  sx?: Record<string, unknown>
  /** Disabled state */
  disabled?: boolean
  /** Test ID for automated testing */
  testId?: string
}
