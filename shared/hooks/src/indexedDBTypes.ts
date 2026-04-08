/**
 * Type definitions for OfflineStore
 */

import type { SyncStatus } from './types'

/** Record stored in offline IndexedDB */
export interface OfflineRecord {
  /** Entity record ID */
  id: string
  /** Entity type name */
  _entity: string
  /** Sync status relative to REST API */
  _syncStatus: SyncStatus
  /** Local modification timestamp */
  _localUpdatedAt: number
  /** The actual entity data */
  [key: string]: unknown
}

/** DB name for offline storage */
export const DB_NAME = 'metabuilder-offline'

/** Initial DB version */
export const DB_VERSION = 1

/**
 * Reserved store for internal bookkeeping.
 * Entity stores are created dynamically.
 */
export const RESERVED_STORE = '_sync_queue'
