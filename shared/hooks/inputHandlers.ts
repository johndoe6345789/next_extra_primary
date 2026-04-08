'use client'

/**
 * Input event handler factories
 */

import {
  ChangeEvent,
  FocusEvent,
  useCallback,
} from 'react'
import type { UseInputOptions } from './inputTypes'

export { useInputValidate } from './inputValidation'

interface InputSetters {
  setValue: (v: string) => void
  setIsDirty: (v: boolean) => void
  setIsTouched: (v: boolean) => void
  setError: (v: string) => void
}

/** Create onChange handler for inputs */
export function useInputChangeHandler(
  initialValue: string,
  error: string,
  options: UseInputOptions | undefined,
  setters: InputSetters
) {
  return useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      let v = e.target.value
      if (options?.trim) v = v.trim()
      if (options?.transform) {
        v = options.transform(v)
      }
      setters.setValue(v)
      setters.setIsDirty(v !== initialValue)
      if (error) setters.setError('')
      options?.onChange?.(v)
    },
    [initialValue, error, options, setters]
  )
}

/** Create onBlur handler for inputs */
export function useInputBlurHandler(
  value: string,
  options: UseInputOptions | undefined,
  setters: Pick<
    InputSetters,
    'setIsTouched' | 'setError'
  >
) {
  return useCallback(
    (
      e: FocusEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setters.setIsTouched(true)
      if (options?.onValidate) {
        const err = options.onValidate(value)
        if (err) setters.setError(err)
      }
      options?.onBlur?.(value)
    },
    [value, options, setters]
  )
}
