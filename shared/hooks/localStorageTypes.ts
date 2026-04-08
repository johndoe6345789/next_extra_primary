/**
 * Type definitions for useLocalStorage hook
 */

/** Options for useLocalStorage */
export interface UseLocalStorageOptions {
  /** Storage version for data migration */
  version?: number
  /** Custom serializer function */
  serializer?: (value: unknown) => string
  /** Custom deserializer function */
  deserializer?: (value: string) => unknown
  /** Sync changes across browser tabs */
  syncTabs?: boolean
}

/** Return type of useLocalStorage */
export interface UseLocalStorageReturn<T> {
  /** Current stored value */
  value: T
  /** Update stored value */
  setValue: (
    value: T | ((prev: T) => T)
  ) => void
  /** Remove and reset to initial */
  clear: () => void
}
