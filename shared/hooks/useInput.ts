'use client'

/**
 * useInput Hook - Managed controlled input state
 */

import { useCallback, useState, useMemo } from 'react'
import type { UseInputOptions, UseInputReturn } from './inputTypes'
import { useInputChangeHandler, useInputBlurHandler } from './inputHandlers'
import { useInputValidate } from './inputValidation'
import { useInputSetValue, useInputReset } from './inputActions'

export type {
  UseInputOptions, UseInputState,
  UseInputHandlers, UseInputReturn,
} from './inputTypes'

/**
 * Hook for managing controlled input state
 * @param initialValue - Initial value
 * @param options - Configuration options
 */
export function useInput(
  initialValue: string = '',
  options?: UseInputOptions
): UseInputReturn {
  const [value, setValue] =
    useState(initialValue)
  const [isDirty, setIsDirty] = useState(false)
  const [isTouched, setIsTouched] =
    useState(false)
  const [error, setError] = useState('')
  const isValid = !error && isDirty

  const setters = useMemo(
    () => ({ setValue, setIsDirty, setIsTouched, setError }),
    []
  )

  const handleChange = useInputChangeHandler(
    initialValue, error, options, setters
  )
  const handleBlur = useInputBlurHandler(
    value, options, setters
  )
  const validate = useInputValidate(
    value, options, setError
  )
  const setProgrammaticValue = useInputSetValue(
    initialValue, setValue, setIsDirty
  )
  const reset = useInputReset(
    initialValue, setValue,
    setIsDirty, setIsTouched, setError
  )
  const touch = useCallback(() => {
    setIsTouched(true)
  }, [])

  return {
    value, isDirty, isTouched, error, isValid,
    handlers: {
      onChange: handleChange,
      onBlur: handleBlur,
      setValue: setProgrammaticValue,
      setError: (e: string) => setError(e),
      clearError: () => setError(''),
      reset, touch, validate,
    },
  }
}

export default useInput
