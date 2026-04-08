/**
 * OfflineStore write CRUD delegators
 */

import type { SyncStatus } from './types'
import type { OfflineRecord } from './indexedDBTypes'
import { transact } from './indexedDBCrud'
import { putManyRecords, countRecords } from './indexedDBCrud'
import type { DBLifecycle } from './indexedDBLifecycle'

/** Write operations delegating to lifecycle */
export function createWriteOps(lc: DBLifecycle) {
  const ensureStore = (name: string) =>
    lc.open(name)

  /** Put (create or update) a record */
  async function put(
    entity: string,
    record: Partial<OfflineRecord> & {
      id: string; _syncStatus: SyncStatus
    }
  ): Promise<OfflineRecord | undefined> {
    const full: OfflineRecord = {
      ...record, _entity: entity,
      _localUpdatedAt: Date.now(),
    } as OfflineRecord
    const db = await ensureStore(entity)
    await transact(db, entity, 'readwrite', (s) => s.put(full))
    return full
  }

  /** Put multiple records */
  async function putMany(
    entity: string,
    records: Array<Partial<OfflineRecord> & {
      id: string; _syncStatus: SyncStatus
    }>
  ): Promise<void> {
    const db = await ensureStore(entity)
    if (!db) return
    return putManyRecords(db, entity, records)
  }

  /** Delete a record by ID */
  async function del(
    entity: string, id: string
  ): Promise<boolean> {
    const db = await ensureStore(entity)
    const r = await transact(db, entity, 'readwrite', (s) => s.delete(id))
    return r !== undefined
  }

  /** Clear all records for an entity */
  async function clear(entity: string): Promise<void> {
    const db = await ensureStore(entity)
    await transact(db, entity, 'readwrite', (s) => s.clear())
  }

  /** Count records for an entity */
  async function count(
    entity: string, syncStatus?: SyncStatus
  ): Promise<number> {
    const db = await ensureStore(entity)
    if (!db) return 0
    return countRecords(db, entity, syncStatus)
  }

  return { put, putMany, del, clear, count }
}
