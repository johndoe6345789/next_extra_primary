'use client'

/**
 * Input programmatic actions (set, reset, touch)
 */

import { useCallback } from 'react'

/**
 * Create programmatic setValue callback
 * @param initialValue - Initial input value
 * @param setValue - Raw state setter
 * @param setIsDirty - Dirty flag setter
 */
export function useInputSetValue(
  initialValue: string,
  setValue: (v: string) => void,
  setIsDirty: (v: boolean) => void
) {
  return useCallback(
    (v: string) => {
      setValue(v)
      setIsDirty(v !== initialValue)
    },
    [initialValue, setValue, setIsDirty]
  )
}

/**
 * Create reset callback for input
 * @param initialValue - Initial input value
 * @param setValue - Value state setter
 * @param setIsDirty - Dirty flag setter
 * @param setIsTouched - Touched flag setter
 * @param setError - Error state setter
 */
export function useInputReset(
  initialValue: string,
  setValue: (v: string) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void
) {
  return useCallback(() => {
    setValue(initialValue)
    setIsDirty(false)
    setIsTouched(false)
    setError('')
  }, [
    initialValue,
    setValue,
    setIsDirty,
    setIsTouched,
    setError,
  ])
}
