/**
 * Type definitions for useFormField hook
 */

/** Validation rule for a field */
export interface ValidationRule<T = unknown> {
  /** Returns true if valid */
  validate: (value: T) => boolean
  /** Error message when invalid */
  message: string
}

/** Configuration for a form field */
export interface FieldConfig<T = unknown> {
  /** Field name identifier */
  name: string
  /** Default/initial value */
  defaultValue?: T
  /** Array of validation rules */
  rules?: ValidationRule<T>[]
}

/** Return type of useFormField */
export interface UseFormFieldReturn<T> {
  /** Current field value */
  value: T | undefined
  /** Error message or null */
  error: string | null
  /** Whether field has been blurred */
  touched: boolean
  /** Handle value change */
  onChange: (newValue: T) => void
  /** Handle blur event */
  onBlur: () => void
  /** Reset to initial state */
  reset: () => void
  /** Validate and return validity */
  validate: () => boolean
  /** Whether field is valid */
  isValid: boolean
  /** Whether value differs from default */
  isDirty: boolean
}

/** Configuration for useForm */
export interface FormConfig {
  /** Field configs keyed by name */
  fields: Record<string, FieldConfig>
  /** Submit handler */
  onSubmit?: (
    values: Record<string, unknown>
  ) => void | Promise<void>
}

/** Return type of useForm */
export interface UseFormReturn {
  /** Submit the form */
  submit: (
    values: Record<string, unknown>
  ) => Promise<void>
  /** Whether form is submitting */
  isSubmitting: boolean
}
