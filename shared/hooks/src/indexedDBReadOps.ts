/**
 * OfflineStore read CRUD delegators
 */

import type { SyncStatus } from './types'
import type { OfflineRecord } from './indexedDBTypes'
import { transact, getAllRecords } from './indexedDBCrud'
import type { DBLifecycle } from './indexedDBLifecycle'

/** Read operations delegating to lifecycle */
export function createReadOps(lc: DBLifecycle) {
  const ensureStore = (name: string) =>
    lc.open(name)

  /** Get all records for an entity */
  async function getAll(
    entity: string,
    syncStatus?: SyncStatus
  ): Promise<OfflineRecord[]> {
    const db = await ensureStore(entity)
    if (!db) return []
    return getAllRecords(db, entity, syncStatus)
  }

  /** Get a single record by ID */
  async function get(
    entity: string,
    id: string
  ): Promise<OfflineRecord | undefined> {
    const db = await ensureStore(entity)
    return transact(
      db, entity, 'readonly',
      (s) => s.get(id)
    ) as Promise<OfflineRecord | undefined>
  }

  return { getAll, get }
}
