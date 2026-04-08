'use client'

/**
 * Field array replace/update operations
 */

import { useCallback } from 'react'
import type { FormField } from './fieldArrayTypes'

/**
 * Creates replace and update handlers
 * @param fields - Current form fields
 * @param updateFields - Field update function
 */
export function useFieldArrayReplace<T>(
  fields: FormField<T>[],
  updateFields: (f: FormField<T>[]) => void
) {
  /** Replace a single field value */
  const replace = useCallback(
    (index: number, value: T) => {
      if (index < 0 || index >= fields.length) {
        return
      }
      const next = [
        ...fields.slice(0, index),
        { ...fields[index], value },
        ...fields.slice(index + 1),
      ]
      updateFields(next)
    },
    [fields, updateFields]
  )

  /** Replace all fields at once */
  const replaceAll = useCallback(
    (values: T[]) => {
      updateFields(
        values.map((value) => ({
          id: crypto.randomUUID(),
          value,
        }))
      )
    },
    [updateFields]
  )

  /** Update partial field value */
  const updateField = useCallback(
    (index: number, value: Partial<T>) => {
      if (index < 0 || index >= fields.length) {
        return
      }
      const next = [
        ...fields.slice(0, index),
        {
          ...fields[index],
          value: {
            ...fields[index].value,
            ...value,
          },
        },
        ...fields.slice(index + 1),
      ]
      updateFields(next)
    },
    [fields, updateFields]
  )

  /** Get field at index */
  const getField = useCallback(
    (index: number) => fields[index],
    [fields]
  )

  return { replace, replaceAll, updateField, getField }
}
