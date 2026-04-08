/**
 * useLocalStorage Hook
 * Enhanced localStorage with versioning
 */

import { useState, useCallback } from 'react'
import type {
  UseLocalStorageOptions,
  UseLocalStorageReturn,
} from './localStorageTypes'
import { useStorageSync } from './localStorageSync'

export type {
  UseLocalStorageOptions,
  UseLocalStorageReturn,
} from './localStorageTypes'

/**
 * Hook for typed localStorage with versioning
 * @param key - Storage key
 * @param initialValue - Default value
 * @param options - Configuration options
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): UseLocalStorageReturn<T> {
  const {
    version = 1,
    serializer = (v) => JSON.stringify({ version, data: v }),
    deserializer = (v) => {
      try {
        const p = JSON.parse(v)
        if (p && typeof p === 'object' && 'version' in p && 'data' in p) {
          return p.version === version ? p.data : initialValue
        }
        return p
      } catch { return initialValue }
    },
    syncTabs = true,
  } = options

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? deserializer(item) : initialValue
    } catch { return initialValue }
  })

  const handleSetValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const v = value instanceof Function ? value(storedValue) : value
        setStoredValue(v)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer(v))
        }
      } catch (err) {
        console.warn(`useLocalStorage: "${key}":`, err)
      }
    },
    [key, serializer, storedValue]
  )

  useStorageSync(key, syncTabs, deserializer, setStoredValue)

  const handleClear = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (err) {
      console.warn(`useLocalStorage clear: "${key}":`, err)
    }
  }, [key, initialValue])

  return { value: storedValue, setValue: handleSetValue, clear: handleClear }
}
