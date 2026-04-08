'use client'

/**
 * Extra field array operations
 */

import type { FormField } from './fieldArrayTypes'
import { useFieldArrayReplace } from './fieldArrayReplace'
import { useFieldArrayStackOps } from './fieldArrayExtraOps'

/** Create extra handlers for field arrays */
export function useFieldArrayExtra<T>(
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
  const {
    replace, replaceAll, updateField, getField,
  } = useFieldArrayReplace(fields, updateFields)

  const stackOps = useFieldArrayStackOps(
    fields, canRemove, initialFormFields,
    updateFields, setFields, setIsDirty,
    setIsTouched, setErrors, appendFn, prependFn
  )

  return {
    replace, replaceAll, updateField,
    getField, ...stackOps,
  }
}
