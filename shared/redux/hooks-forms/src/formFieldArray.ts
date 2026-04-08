/**
 * Form Field Array Helper
 * Creates array manipulation operations
 * for a specific form field.
 */

import type { FormFieldArray } from './formBuilderTypes'

/**
 * Build field array operations
 * @template T Form type
 * @param fieldValue - Current array value
 * @param setFieldValue - Setter for the field
 * @param field - Field name
 * @returns Field array operations
 */
export function buildFieldArray<
  T extends Record<string, any>,
  K extends keyof T
>(
  fieldValue: T[K],
  setFieldValue: (
    field: K,
    value: T[K]
  ) => void,
  field: K
): FormFieldArray<T[K][number]> {
  if (!Array.isArray(fieldValue)) {
    throw new Error(
      `Field ${String(field)} is not an array`
    )
  }

  return {
    values: fieldValue,
    add: (value) => {
      setFieldValue(
        field,
        [...fieldValue, value] as T[K]
      )
    },
    remove: (index) => {
      setFieldValue(
        field,
        fieldValue.filter(
          (_item: unknown, i: number) =>
            i !== index
        ) as T[K]
      )
    },
    insert: (index, value) => {
      const arr = [...fieldValue]
      arr.splice(index, 0, value)
      setFieldValue(field, arr as T[K])
    },
    move: (fromIndex, toIndex) => {
      const arr = [...fieldValue]
      const [removed] = arr.splice(fromIndex, 1)
      arr.splice(toIndex, 0, removed)
      setFieldValue(field, arr as T[K])
    },
    clear: () => {
      setFieldValue(field, [] as T[K])
    },
  }
}
