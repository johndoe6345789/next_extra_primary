/**
 * OfflineStore read/write delegated operations
 */

import type { SyncStatus } from './types'
import type { OfflineRecord } from './indexedDBTypes'
import { DBLifecycle } from './indexedDBLifecycle'
import { createCrudOps } from './indexedDBOps'

/** Delegated CRUD operations */
export class StoreOperations {
  private lc: DBLifecycle
  private ops: ReturnType<typeof createCrudOps>

  constructor() {
    this.lc = new DBLifecycle()
    this.ops = createCrudOps(this.lc)
  }

  /** Close the database */
  close(): void { this.lc.close() }

  /** Get all records */
  async getAll(
    entity: string,
    syncStatus?: SyncStatus
  ): Promise<OfflineRecord[]> {
    return this.ops.getAll(entity, syncStatus)
  }

  /** Get single record */
  async get(
    entity: string,
    id: string
  ): Promise<OfflineRecord | undefined> {
    return this.ops.get(entity, id)
  }

  /** Upsert a record */
  async put(
    entity: string,
    record: Partial<OfflineRecord> &
      { id: string; _syncStatus: SyncStatus }
  ): Promise<OfflineRecord | undefined> {
    return this.ops.put(entity, record)
  }

  /** Upsert multiple records */
  async putMany(
    entity: string,
    records: Array<Partial<OfflineRecord> &
      { id: string; _syncStatus: SyncStatus }>
  ): Promise<void> {
    return this.ops.putMany(entity, records)
  }

  /** Delete a record */
  async del(
    entity: string, id: string
  ): Promise<boolean> {
    return this.ops.del(entity, id)
  }

  /** Clear all records */
  async clear(entity: string): Promise<void> {
    return this.ops.clear(entity)
  }

  /** Count records */
  async count(
    entity: string,
    syncStatus?: SyncStatus
  ): Promise<number> {
    return this.ops.count(entity, syncStatus)
  }
}
