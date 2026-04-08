'use client'

/**
 * Field array insert and remove operations
 */

import { useCallback } from 'react'
import type { FormField } from './fieldArrayTypes'

/**
 * Creates insert and remove handlers
 * @param fields - Current form fields
 * @param canRemove - Whether removal is allowed
 * @param updateFields - Field update function
 * @param setErrors - Errors state setter
 */
export function useFieldArrayInsertRemove<T>(
  fields: FormField<T>[],
  canRemove: boolean,
  updateFields: (f: FormField<T>[]) => void,
  setErrors: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >
) {
  /** Insert a field at a specific index */
  const insert = useCallback(
    (index: number, value: T) => {
      if (index < 0 || index > fields.length) {
        return
      }
      const newField: FormField<T> = {
        id: crypto.randomUUID(),
        value,
      }
      const next = [
        ...fields.slice(0, index),
        newField,
        ...fields.slice(index),
      ]
      updateFields(next)
    },
    [fields, updateFields]
  )

  /** Remove a field at a specific index */
  const remove = useCallback(
    (index: number) => {
      if (index < 0 || index >= fields.length) {
        return
      }
      if (!canRemove) return
      updateFields(
        fields.filter((_, i) => i !== index)
      )
      setErrors((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
    },
    [
      fields,
      canRemove,
      updateFields,
      setErrors,
    ]
  )

  return { insert, remove }
}
