'use client'

/**
 * useCheckbox Hook
 *
 * Manages checkbox state for single and multiple.
 *
 * @example
 * const { checked, handlers } = useCheckbox(false)
 * <input
 *   type="checkbox"
 *   checked={checked}
 *   onChange={handlers.onChange}
 * />
 */

import { useState } from 'react'
import type {
  UseCheckboxOptions,
  UseCheckboxSingleReturn,
  UseCheckboxMultiReturn,
} from './checkboxTypes'
import { buildSingleCheckbox } from './checkboxSingle'
import { buildMultiCheckbox } from './checkboxMulti'

/** Hook for managing single checkbox state */
export function useCheckbox(
  initialChecked: boolean,
  options?: UseCheckboxOptions<boolean>
): UseCheckboxSingleReturn

/** Hook for managing multiple checkbox state */
export function useCheckbox<
  T extends Record<string, boolean>,
>(
  initialValues: T,
  options?: UseCheckboxOptions<T>
): UseCheckboxMultiReturn<T>

/** Implementation */
export function useCheckbox<
  T extends boolean | Record<string, boolean>,
>(
  initialValue: T,
  options?: UseCheckboxOptions<T>
): UseCheckboxSingleReturn | UseCheckboxMultiReturn<
  Record<string, boolean>
> {
  const isSingle = typeof initialValue === 'boolean'
  const [value, setValue] = useState<T>(initialValue)
  const [isDirty, setIsDirty] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [error, setError] = useState('')

  if (isSingle) {
    return buildSingleCheckbox(
      value as boolean,
      initialValue as boolean,
      options,
      error, isDirty, isTouched,
      (v) => setValue(v as T),
      setIsDirty, setIsTouched, setError
    )
  }

  return buildMultiCheckbox(
    value as Record<string, boolean>,
    initialValue as Record<string, boolean>,
    options as UseCheckboxOptions<
      Record<string, boolean>
    >,
    error, isDirty, isTouched,
    (v) => setValue(v as T),
    setIsDirty, setIsTouched, setError
  )
}

export default useCheckbox
