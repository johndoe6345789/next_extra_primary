/**
 * OfflineStore - IndexedDB singleton for
 * offline DBAL entity caching.
 * SSR-safe: returns empty when unavailable.
 */

import type { SyncStatus } from './types'
import type { OfflineRecord } from './indexedDBTypes'
import { StoreOperations } from './offlineStoreOps'

export type { OfflineRecord } from './indexedDBTypes'

type PutRecord = Partial<OfflineRecord> &
  { id: string; _syncStatus: SyncStatus }

/** Singleton IndexedDB storage engine */
export class OfflineStore {
  private static instance: OfflineStore | null =
    null
  private ops = new StoreOperations()
  private constructor() {}

  /** Get singleton instance */
  static getInstance(): OfflineStore {
    if (!OfflineStore.instance)
      OfflineStore.instance = new OfflineStore()
    return OfflineStore.instance
  }

  /** Reset singleton (testing only) */
  static resetInstance(): void {
    if (OfflineStore.instance) {
      OfflineStore.instance.close()
      OfflineStore.instance = null
    }
  }

  /** Close the database */
  close(): void { this.ops.close() }

  /** Get all records */
  async getAll(
    e: string, s?: SyncStatus
  ): Promise<OfflineRecord[]> {
    return this.ops.getAll(e, s)
  }

  /** Get a single record */
  async get(
    e: string, id: string
  ): Promise<OfflineRecord | undefined> {
    return this.ops.get(e, id)
  }

  /** Upsert a record */
  async put(
    e: string, r: PutRecord
  ): Promise<OfflineRecord | undefined> {
    return this.ops.put(e, r)
  }

  /** Upsert multiple records */
  async putMany(
    e: string, r: PutRecord[]
  ): Promise<void> {
    return this.ops.putMany(e, r)
  }

  /** Delete a record */
  async delete(
    e: string, id: string
  ): Promise<boolean> {
    return this.ops.del(e, id)
  }

  /** Clear all records */
  async clear(e: string): Promise<void> {
    return this.ops.clear(e)
  }

  /** Count records */
  async count(
    e: string, s?: SyncStatus
  ): Promise<number> {
    return this.ops.count(e, s)
  }
}
