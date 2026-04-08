/**
 * Type definitions for useFieldArray hook
 */

/** Field with unique identifier */
export interface FormField<T = unknown> {
  id: string
  value: T
}

/** Configuration options */
export interface UseFieldArrayOptions<T> {
  /** Callback when fields change */
  onChange?: (fields: FormField<T>[]) => void
  /** Min number of fields */
  minFields?: number
  /** Max number of fields */
  maxFields?: number
  /** Validation function for each field */
  validateField?: (value: T, index: number) => string
}

/** State shape for useFieldArray */
export interface UseFieldArrayState<T> {
  fields: FormField<T>[]
  isDirty: boolean
  isTouched: boolean
  errors: Record<number, string>
  count: number
  canAdd: boolean
  canRemove: boolean
}

/** Handler methods for useFieldArray */
export interface UseFieldArrayHandlers<T> {
  append: (
    value: T,
    options?: { atIndex?: number }
  ) => void
  prepend: (value: T) => void
  remove: (index: number) => void
  insert: (index: number, value: T) => void
  move: (from: number, to: number) => void
  swap: (indexA: number, indexB: number) => void
  replace: (index: number, value: T) => void
  replaceAll: (values: T[]) => void
  updateField: (
    index: number,
    value: Partial<T>
  ) => void
  getField: (
    index: number
  ) => FormField<T> | undefined
  clear: () => void
  reset: () => void
  shift: () => FormField<T> | undefined
  pop: () => FormField<T> | undefined
  unshift: (value: T) => void
  push: (value: T) => void
  touch: () => void
  validateField: (index: number) => boolean
  validateAll: () => boolean
  setFieldError: (index: number, error: string) => void
  clearFieldError: (index: number) => void
  clearErrors: () => void
}

/** Return type for useFieldArray */
export interface UseFieldArrayReturn<T>
  extends UseFieldArrayState<T> {
  handlers: UseFieldArrayHandlers<T>
}
