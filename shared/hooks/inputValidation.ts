'use client'

/**
 * Input validation handler factory
 */

import { useCallback } from 'react'
import type { UseInputOptions } from './inputTypes'

/**
 * Create validate function for inputs
 * @param value - Current input value
 * @param options - Input configuration
 * @param setError - Error state setter
 * @returns Validation function
 */
export function useInputValidate(
  value: string,
  options: UseInputOptions | undefined,
  setError: (v: string) => void
) {
  return useCallback((): boolean => {
    if (options?.onValidate) {
      const err = options.onValidate(value)
      if (err) {
        setError(err)
        return false
      }
    }
    setError('')
    return true
  }, [value, options, setError])
}
