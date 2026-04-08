/**
 * useUnifiedStorage hook implementation
 */

import { useState, useEffect } from 'react'
import type { StorageBackendAdapter } from './unifiedStorageTypes'
import {
  useStorageUpdate,
  useStorageDelete,
} from './unifiedStorageOps'

/**
 * Hook for reading/writing values to unified
 * storage.
 *
 * @param key - The storage key
 * @param defaultValue - Default if key missing
 * @param adapter - Storage adapter instance
 * @returns [value, setValue, deleteValue]
 */
export function useUnifiedStorage<T>(
  key: string,
  defaultValue: T,
  adapter: StorageBackendAdapter
): [
  T,
  (value: T | ((prev: T) => T)) => Promise<void>,
  () => Promise<void>,
] {
  const [value, setValue] =
    useState<T>(defaultValue)
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const stored =
          await adapter.get<T>(key)
        if (mounted) {
          setValue(
            stored !== undefined
              ? stored
              : defaultValue
          )
        }
      } catch (err) {
        console.error(
          `Failed to load ${key}:`,
          err
        )
        if (mounted) setValue(defaultValue)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [key, defaultValue, adapter])

  const updateValue = useStorageUpdate(
    key, value, setValue, adapter
  )
  const deleteValue = useStorageDelete(
    key, defaultValue, setValue, adapter
  )

  return [value, updateValue, deleteValue]
}
