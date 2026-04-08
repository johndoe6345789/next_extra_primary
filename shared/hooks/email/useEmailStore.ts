import { useCallback } from 'react'
import type {
  StoredMessage,
  UseEmailStoreResult,
} from './emailStoreTypes'
import { STORE_NAME } from './emailStoreTypes'
import { useEmailDbInit } from './emailStoreInit'
import { useEmailStoreWrite } from './emailStoreOps'

export type {
  StoredMessage,
  UseEmailStoreResult,
} from './emailStoreTypes'

/**
 * IndexedDB wrapper for offline email storage
 */
export function useEmailStore(
): UseEmailStoreResult {
  const { db, isReady, error } =
    useEmailDbInit()

  const getMessages = useCallback(
    async (
      folderName?: string
    ): Promise<StoredMessage[]> => {
      if (!db) return []
      return new Promise((resolve, reject) => {
        const tx = db.transaction(
          STORE_NAME,
          'readonly'
        )
        const store = tx.objectStore(
          STORE_NAME
        )
        const req = store.getAll()
        req.onsuccess = () => {
          const msgs =
            req.result as StoredMessage[]
          const filtered = folderName
            ? msgs.filter(
                (m) =>
                  m.folderName === folderName
              )
            : msgs
          resolve(filtered)
        }
        req.onerror = () =>
          reject(
            new Error('Failed to retrieve')
          )
      })
    },
    [db]
  )

  const { saveMessages, clear } =
    useEmailStoreWrite(db)

  return {
    getMessages, saveMessages,
    clear, isReady, error,
  }
}
