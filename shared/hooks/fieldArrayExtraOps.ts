'use client'

/**
 * Extra field array reset/stack operations:
 * clear, reset, shift, pop, unshift, push, touch
 */

import { useCallback } from 'react'
import type { FormField } from './fieldArrayTypes'

/** Create stack-like field array handlers */
export function useFieldArrayStackOps<T>(
  fields: FormField<T>[],
  canRemove: boolean,
  initialFormFields: FormField<T>[],
  updateFields: (f: FormField<T>[]) => void,
  setFields: React.Dispatch<
    React.SetStateAction<FormField<T>[]>
  >,
  setIsDirty: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  setIsTouched: React.Dispatch<
    React.SetStateAction<boolean>
  >,
  setErrors: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >,
  appendFn: (value: T) => void,
  prependFn: (value: T) => void
) {
  /** Clear all fields */
  const clear = useCallback(() => {
    updateFields([])
    setErrors({})
  }, [updateFields, setErrors])

  /** Reset to initial state */
  const reset = useCallback(() => {
    setFields(initialFormFields)
    setIsDirty(false)
    setIsTouched(false)
    setErrors({})
  }, [
    initialFormFields, setFields,
    setIsDirty, setIsTouched, setErrors,
  ])

  /** Remove and return first field */
  const shift = useCallback(() => {
    if (fields.length === 0 || !canRemove) {
      return
    }
    const [first, ...rest] = fields
    updateFields(rest)
    return first
  }, [fields, canRemove, updateFields])

  /** Remove and return last field */
  const pop = useCallback(() => {
    if (fields.length === 0 || !canRemove) {
      return
    }
    const last = fields[fields.length - 1]
    updateFields(fields.slice(0, -1))
    return last
  }, [fields, canRemove, updateFields])

  const unshift = useCallback(
    (value: T) => prependFn(value),
    [prependFn]
  )
  const push = useCallback(
    (value: T) => appendFn(value),
    [appendFn]
  )
  const touch = useCallback(
    () => setIsTouched(true),
    [setIsTouched]
  )

  return {
    clear, reset, shift, pop,
    unshift, push, touch,
  }
}
