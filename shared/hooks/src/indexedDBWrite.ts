/**
 * IndexedDB write operations
 */

import type { SyncStatus } from './types'
import type { OfflineRecord } from './indexedDBTypes'

/**
 * Put multiple records in a single transaction.
 */
export function putManyRecords(
  db: IDBDatabase,
  entity: string,
  records: Array<
    Partial<OfflineRecord> & {
      id: string
      _syncStatus: SyncStatus
    }
  >
): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(entity, 'readwrite')
      const store = tx.objectStore(entity)
      const now = Date.now()
      for (const record of records) {
        const full: OfflineRecord = {
          ...record,
          _entity: entity,
          _localUpdatedAt: now,
        } as OfflineRecord
        store.put(full)
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    } catch {
      resolve()
    }
  })
}

/**
 * Count records, optionally by sync status.
 */
export function countRecords(
  db: IDBDatabase,
  entity: string,
  syncStatus?: SyncStatus
): Promise<number> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(entity, 'readonly')
      const store = tx.objectStore(entity)
      let req: IDBRequest<number>
      if (syncStatus) {
        const idx = store.index('_syncStatus')
        req = idx.count(syncStatus)
      } else {
        req = store.count()
      }
      req.onsuccess = () => resolve(req.result ?? 0)
      req.onerror = () => resolve(0)
    } catch {
      resolve(0)
    }
  })
}
