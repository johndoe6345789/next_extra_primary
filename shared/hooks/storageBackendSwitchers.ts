/**
 * Storage backend switch operations
 */

import { useCallback } from 'react'
import { getStorageAdapter } from './use-unified-storage'

/**
 * Create backend switch callbacks
 * @param setBackend - State setter for backend
 * @param setIsLoading - Loading state setter
 */
export function useBackendSwitchers(
  setBackend: (v: string) => void,
  setIsLoading: (v: boolean) => void
) {
  const switchToFlask = useCallback(
    async (backendUrl?: string) => {
      setIsLoading(true)
      try {
        await getStorageAdapter()
          .switchToFlask(backendUrl)
        setBackend('flask')
      } catch (err) {
        console.error(
          'Failed to switch to Flask:',
          err
        )
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [setBackend, setIsLoading]
  )

  const switchToIndexedDB = useCallback(
    async () => {
      setIsLoading(true)
      try {
        await getStorageAdapter()
          .switchToIndexedDB()
        setBackend('indexeddb')
      } catch (err) {
        console.error(
          'Failed to switch to IndexedDB:',
          err
        )
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [setBackend, setIsLoading]
  )

  const switchToSQLite = useCallback(
    async () => {
      setIsLoading(true)
      try {
        await getStorageAdapter()
          .switchToSQLite()
        setBackend('sqlite')
      } catch (err) {
        console.error(
          'Failed to switch to SQLite:',
          err
        )
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [setBackend, setIsLoading]
  )

  return {
    switchToFlask,
    switchToIndexedDB,
    switchToSQLite,
  }
}
