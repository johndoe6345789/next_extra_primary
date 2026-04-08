'use client'

/**
 * Core field array operations: append, prepend,
 * insert, remove, move, swap.
 */

import { useCallback } from 'react'
import type { FormField } from './fieldArrayTypes'
import { useFieldArrayMoveSwap } from './fieldArrayMoveSwap'
import { useFieldArrayInsertRemove } from './fieldArrayInsertRemove'

/** Create core mutation handlers */
export function useFieldArrayCore<T>(
  fields: FormField<T>[],
  canAdd: boolean,
  canRemove: boolean,
  updateFields: (f: FormField<T>[]) => void,
  setErrors: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >
) {
  /** Append a field at end or given index */
  const append = useCallback(
    (value: T, opts?: { atIndex?: number }) => {
      if (!canAdd) return
      const newField: FormField<T> = {
        id: crypto.randomUUID(),
        value,
      }
      const idx =
        opts?.atIndex ?? fields.length
      const next = [
        ...fields.slice(0, idx),
        newField,
        ...fields.slice(idx),
      ]
      updateFields(next)
    },
    [fields, canAdd, updateFields]
  )

  /** Prepend a field at the beginning */
  const prepend = useCallback(
    (value: T) =>
      append(value, { atIndex: 0 }),
    [append]
  )

  const { insert, remove } =
    useFieldArrayInsertRemove(
      fields, canRemove, updateFields, setErrors
    )

  const { move, swap } =
    useFieldArrayMoveSwap(fields, updateFields)

  return {
    append, prepend, insert,
    remove, move, swap,
  }
}
