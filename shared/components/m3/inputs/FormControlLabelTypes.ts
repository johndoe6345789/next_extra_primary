import React from 'react'

/**
 * Props for FormControlLabel (MUI-compatible)
 */
export interface FormControlLabelProps
  extends Omit<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    'onChange'
  > {
  testId?: string
  /** The control element (Checkbox, Radio, Switch) */
  control: React.ReactElement
  /** The label text or element */
  label: React.ReactNode
  /** Whether the control is disabled */
  disabled?: boolean
  /** Label placement relative to the control */
  labelPlacement?:
    | 'end'
    | 'start'
    | 'top'
    | 'bottom'
  /** Value for form submission */
  value?: unknown
  /** MUI sx prop for styling compatibility */
  sx?: Record<string, unknown>
}
