/**
 * Unified storage update/delete operations
 */

import { useCallback } from 'react'
import type {
  StorageBackendAdapter,
} from './unifiedStorageTypes'

/**
 * Create an update callback for storage
 * @param key - Storage key
 * @param value - Current value
 * @param setValue - State setter
 * @param adapter - Storage adapter
 */
export function useStorageUpdate<T>(
  key: string,
  value: T,
  setValue: (v: T) => void,
  adapter: StorageBackendAdapter
) {
  return useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      try {
        const v =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(value)
            : newValue
        setValue(v)
        await adapter.set(key, v)
      } catch (err) {
        console.error(
          `Failed to save ${key}:`,
          err
        )
        throw err
      }
    },
    [key, value, adapter, setValue]
  )
}

/**
 * Create a delete callback for storage
 * @param key - Storage key
 * @param defaultValue - Value to reset to
 * @param setValue - State setter
 * @param adapter - Storage adapter
 */
export function useStorageDelete<T>(
  key: string,
  defaultValue: T,
  setValue: (v: T) => void,
  adapter: StorageBackendAdapter
) {
  return useCallback(async () => {
    try {
      setValue(defaultValue)
      await adapter.delete(key)
    } catch (err) {
      console.error(
        `Failed to delete ${key}:`,
        err
      )
      throw err
    }
  }, [key, defaultValue, adapter, setValue])
}
