/**
 * Email store read/write operations
 */

import { useCallback } from 'react'
import type { StoredMessage } from './emailStoreTypes'
import { STORE_NAME } from './emailStoreTypes'

/**
 * Build saveMessages and clear callbacks
 * @param db - IndexedDB database instance
 */
export function useEmailStoreWrite(
  db: IDBDatabase | null
) {
  const saveMessages = useCallback(
    async (
      msgs: StoredMessage[]
    ): Promise<void> => {
      if (!db) return
      return new Promise((resolve, reject) => {
        const tx = db.transaction(
          STORE_NAME,
          'readwrite'
        )
        const store = tx.objectStore(STORE_NAME)
        msgs.forEach((m) =>
          store.put({
            ...m,
            createdAt: Date.now(),
          })
        )
        tx.oncomplete = () => resolve()
        tx.onerror = () =>
          reject(new Error('Failed to save'))
      })
    },
    [db]
  )

  const clear = useCallback(async () => {
    if (!db) return
    return new Promise<void>(
      (resolve, reject) => {
        const tx = db.transaction(
          STORE_NAME,
          'readwrite'
        )
        const store = tx.objectStore(STORE_NAME)
        const req = store.clear()
        req.onsuccess = () => resolve()
        req.onerror = () =>
          reject(new Error('Failed to clear'))
      }
    )
  }, [db])

  return { saveMessages, clear }
}
