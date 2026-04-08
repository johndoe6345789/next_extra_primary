/**
 * Unified Storage System
 *
 * Provides storage adapter configuration and
 * the useUnifiedStorage hook.
 */

import type { StorageBackendAdapter } from './unifiedStorageTypes'
import { defaultStorageAdapter } from './unifiedStorageTypes'
import { useUnifiedStorage as useUnifiedStorageImpl } from './unifiedStorageHook'

export type {
  StorageBackendType,
  StorageBackendAdapter,
} from './unifiedStorageTypes'

export { useStorageBackend } from './useStorageBackend'

let storageAdapter: StorageBackendAdapter =
  defaultStorageAdapter

/**
 * Configure the storage adapter for the app.
 * Call once during initialization.
 */
export function configureStorageAdapter(
  adapter: StorageBackendAdapter
): void {
  storageAdapter = adapter
}

/** Get the current storage adapter */
export function getStorageAdapter():
  StorageBackendAdapter {
  return storageAdapter
}

/**
 * Hook for reading/writing values to unified
 * storage.
 *
 * @param key - The storage key
 * @param defaultValue - Default if key missing
 * @returns [value, setValue, deleteValue]
 */
export function useUnifiedStorage<T>(
  key: string,
  defaultValue: T
): [
  T,
  (value: T | ((prev: T) => T)) => Promise<void>,
  () => Promise<void>,
] {
  return useUnifiedStorageImpl(
    key,
    defaultValue,
    storageAdapter
  )
}
