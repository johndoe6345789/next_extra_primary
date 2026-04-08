/**
 * IndexedDB initialization for email store
 */

import { useEffect, useState } from 'react'
import {
  DB_NAME,
  STORE_NAME,
  DB_VERSION,
} from './emailStoreTypes'
import {
  handleEmailUpgrade,
  handleOpenSuccess,
} from './emailStoreOpenDb'

/** Hook for initializing email IndexedDB */
export function useEmailDbInit() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<
    Error | null
  >(null)
  const [db, setDb] = useState<
    IDBDatabase | null
  >(null)

  useEffect(() => {
    const init = () => {
      try {
        const req = indexedDB.open(
          DB_NAME,
          DB_VERSION
        )
        req.onerror = () => {
          setError(
            new Error(
              'Failed to open IndexedDB'
            )
          )
        }
        req.onsuccess = () => {
          handleOpenSuccess(
            req,
            DB_NAME,
            DB_VERSION,
            setDb,
            setIsReady
          )
        }
        req.onupgradeneeded =
          handleEmailUpgrade
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to init')
        )
      }
    }
    init()
    return () => {
      db?.close()
    }
  }, [])

  return { db, isReady, error }
}
