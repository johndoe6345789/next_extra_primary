'use client'

/**
 * Multi-select validation and reset logic
 */

import type { UseSelectOptions } from './selectTypes'

/**
 * Create validation callback for multi-select
 * @param values - Currently selected values
 * @param options - Select configuration
 * @param setError - Error state setter
 */
export function createMultiValidate<T>(
  values: T[],
  options: UseSelectOptions<T, true>,
  setError: (v: string) => void
): () => boolean {
  return (): boolean => {
    if (options.onValidate) {
      const err = options.onValidate(
        values as never
      )
      if (err) {
        setError(err)
        return false
      }
    }
    setError('')
    return true
  }
}

/**
 * Create reset callback for multi-select
 * @param initialValue - Original values
 * @param setValue - Value state setter
 * @param setIsDirty - Dirty flag setter
 * @param setIsTouched - Touched flag setter
 * @param setError - Error state setter
 * @param setSearchTerm - Search term setter
 */
export function createMultiReset<T>(
  initialValue: T[],
  setValue: (v: T[]) => void,
  setIsDirty: (v: boolean) => void,
  setIsTouched: (v: boolean) => void,
  setError: (v: string) => void,
  setSearchTerm: (v: string) => void
): () => void {
  return () => {
    setValue(initialValue)
    setIsDirty(false)
    setIsTouched(false)
    setError('')
    setSearchTerm('')
  }
}
