/**
 * IndexedDB transaction helper and read ops
 */

import type { SyncStatus } from './types'
import type { OfflineRecord } from './indexedDBTypes'

/**
 * Execute a transaction-based IDB operation.
 */
export function transact<R>(
  db: IDBDatabase | null,
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<R>
): Promise<R | undefined> {
  return new Promise((resolve) => {
    if (!db) {
      resolve(undefined)
      return
    }
    try {
      const tx = db.transaction(storeName, mode)
      const store = tx.objectStore(storeName)
      const req = fn(store)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => resolve(undefined)
    } catch {
      resolve(undefined)
    }
  })
}

/**
 * Get all records, optionally by sync status.
 */
export function getAllRecords(
  db: IDBDatabase,
  entity: string,
  syncStatus?: SyncStatus
): Promise<OfflineRecord[]> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(entity, 'readonly')
      const store = tx.objectStore(entity)
      let req: IDBRequest
      if (syncStatus) {
        const idx = store.index('_syncStatus')
        req = idx.getAll(syncStatus)
      } else {
        req = store.getAll()
      }
      req.onsuccess = () =>
        resolve((req.result as OfflineRecord[]) ?? [])
      req.onerror = () => resolve([])
    } catch {
      resolve([])
    }
  })
}
