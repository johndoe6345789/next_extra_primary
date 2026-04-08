/**
 * Cross-tab sync effect for localStorage
 */

import { useEffect } from 'react'

/** Sync localStorage changes across tabs */
export function useStorageSync<T>(
  key: string,
  syncTabs: boolean,
  deserializer: (v: string) => T,
  setStoredValue: (v: T) => void
) {
  useEffect(() => {
    if (!syncTabs || typeof window === 'undefined') return
    const handleChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(deserializer(e.newValue))
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', handleChange)
    return () => {
      window.removeEventListener('storage', handleChange)
    }
  }, [key, deserializer, syncTabs, setStoredValue])
}
