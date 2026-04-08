/**
 * Form Builder Type Definitions
 * Types for form state, validation, and
 * field array operations.
 */

/** @brief Validation errors keyed by field */
export type ValidationErrors<T> = Partial<
  Record<keyof T, string>
>

/** @brief Field array operations */
export interface FormFieldArray<T> {
  values: T[]
  add: (value: T) => void
  remove: (index: number) => void
  insert: (index: number, value: T) => void
  move: (from: number, to: number) => void
  clear: () => void
}

/** @brief Options for useFormBuilder */
export interface UseFormBuilderOptions<T> {
  /** Initial form values */
  initialValues: T
  /** Validate form - return errors */
  validation?: (
    values: T
  ) => ValidationErrors<T>
  /** Called on form submission */
  onSubmit: (values: T) => Promise<void> | void
  /** Validate on blur - default true */
  validateOnBlur?: boolean
  /** Validate on change - default false */
  validateOnChange?: boolean
}

/** @brief Return type for useFormBuilder */
export interface UseFormBuilderReturn<T> {
  values: T
  setFieldValue: <K extends keyof T>(
    field: K,
    value: T[K]
  ) => void
  setValues: (values: Partial<T>) => void
  errors: ValidationErrors<T>
  getFieldError: <K extends keyof T>(
    field: K
  ) => string | undefined
  hasError: <K extends keyof T>(
    field: K
  ) => boolean
  touched: Partial<Record<keyof T, boolean>>
  setFieldTouched: <K extends keyof T>(
    field: K,
    isTouched?: boolean
  ) => void
  setTouched: (
    touched: Partial<Record<keyof T, boolean>>
  ) => void
  isDirty: boolean
  dirty: Partial<Record<keyof T, boolean>>
  resetField: <K extends keyof T>(
    field: K
  ) => void
  submit: () => Promise<void>
  isSubmitting: boolean
  submitError: string | null
  reset: () => void
  isValid: boolean
  isValidating: boolean
  getFieldArray: <K extends keyof T>(
    field: K
  ) => FormFieldArray<any>
}
