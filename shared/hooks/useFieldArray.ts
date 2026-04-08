'use client'

/**
 * useFieldArray Hook
 *
 * Manages dynamic form field arrays with add/remove/
 * reorder operations.
 *
 * @example
 * const { fields, handlers } = useFieldArray([])
 * handlers.append({ value: '' })
 */

import { useCallback, useState } from 'react'
import type {
  FormField,
  UseFieldArrayOptions,
  UseFieldArrayReturn,
} from './fieldArrayTypes'
import { useFieldArrayCore } from './fieldArrayCore'
import { useFieldArrayExtra } from './fieldArrayExtra'
import { useFieldArrayValidation } from './fieldArrayValidation'

export type { FormField } from './fieldArrayTypes'

/**
 * Hook for managing dynamic form field arrays
 *
 * @param initialFields Initial field values
 * @param options Configuration options
 * @returns Field array state and handlers
 */
export function useFieldArray<T = unknown>(
  initialFields: T[] = [],
  options?: UseFieldArrayOptions<T>
): UseFieldArrayReturn<T> {
  const initialFormFields: FormField<T>[] =
    initialFields.map((value) => ({
      id: crypto.randomUUID(), value,
    }))

  const [fields, setFields] =
    useState<FormField<T>[]>(initialFormFields)
  const [isDirty, setIsDirty] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [errors, setErrors] =
    useState<Record<number, string>>({})

  const count = fields.length
  const canAdd =
    !options?.maxFields || count < options.maxFields
  const canRemove =
    !options?.minFields || count > options.minFields

  const updateFields = useCallback(
    (newFields: FormField<T>[]) => {
      setFields(newFields)
      setIsDirty(
        JSON.stringify(newFields) !==
        JSON.stringify(initialFormFields)
      )
      options?.onChange?.(newFields)
    },
    [initialFormFields, options]
  )

  const core = useFieldArrayCore(
    fields, canAdd, canRemove, updateFields, setErrors
  )
  const extra = useFieldArrayExtra(
    fields, canRemove, initialFormFields,
    updateFields, setFields, setIsDirty,
    setIsTouched, setErrors, core.append, core.prepend
  )
  const validation = useFieldArrayValidation(
    fields, options, setErrors
  )

  return {
    fields, isDirty, isTouched, errors,
    count, canAdd, canRemove,
    handlers: { ...core, ...extra, ...validation },
  }
}

export default useFieldArray
