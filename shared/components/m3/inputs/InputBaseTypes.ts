import React from 'react'

/**
 * Props for ButtonBase component
 */
export interface ButtonBaseProps
  extends React.HTMLAttributes<HTMLElement> {
  component?: React.ElementType
  children?: React.ReactNode
  disabled?: boolean
  onClick?: React.MouseEventHandler
  onFocus?: React.FocusEventHandler
  onBlur?: React.FocusEventHandler
  tabIndex?: number
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Props for InputBase component
 */
export interface InputBaseProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue' | 'onFocus' | 'onBlur'
  > {
  testId?: string
  disabled?: boolean
  error?: boolean
  fullWidth?: boolean
  multiline?: boolean
  rows?: number
  minRows?: number
  maxRows?: number
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  inputComponent?: React.ElementType
  inputProps?:
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.TextareaHTMLAttributes<
        HTMLTextAreaElement
      >
  inputRef?: React.Ref<
    HTMLInputElement | HTMLTextAreaElement
  >
  value?: string | number
  defaultValue?: string | number
  onChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
  onFocus?: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
  onBlur?: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  type?: string
}

/**
 * Props for FilledInput component
 */
export interface FilledInputProps
  extends InputBaseProps {}

/**
 * Props for OutlinedInput component
 */
export interface OutlinedInputProps
  extends InputBaseProps {
  label?: React.ReactNode
  notched?: boolean
}
