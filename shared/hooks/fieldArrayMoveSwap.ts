'use client'

/**
 * Field array move and swap operations
 */

import { useCallback } from 'react'
import type { FormField } from './fieldArrayTypes'

/** Create move/swap handlers for fields */
export function useFieldArrayMoveSwap<T>(
  fields: FormField<T>[],
  updateFields: (f: FormField<T>[]) => void
) {
  /** Move a field from one index to another */
  const move = useCallback(
    (from: number, to: number) => {
      if (from === to) return
      if (from < 0 || from >= fields.length) {
        return
      }
      if (to < 0 || to >= fields.length) {
        return
      }
      const next = [...fields]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      updateFields(next)
    },
    [fields, updateFields]
  )

  /** Swap two fields */
  const swap = useCallback(
    (a: number, b: number) => {
      if (a === b) return
      if (a < 0 || a >= fields.length) return
      if (b < 0 || b >= fields.length) return
      const next = [...fields]
      ;[next[a], next[b]] = [next[b], next[a]]
      updateFields(next)
    },
    [fields, updateFields]
  )

  return { move, swap }
}
