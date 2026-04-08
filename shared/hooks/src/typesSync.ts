/**
 * Offline sync and config types
 */

/** Async state wrapper */
export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

/** Record sync status in IndexedDB */
export type SyncStatus =
  | 'synced'
  | 'pending-create'
  | 'pending-update'
  | 'pending-delete'

/** A queued mutation for sync */
export interface SyncQueueEntry {
  /** Unique queue entry ID */
  id: string
  /** Entity name */
  entity: string
  /** Type of mutation */
  operation: 'create' | 'update' | 'delete'
  /** Payload data */
  data: Record<string, unknown>
  /** When the mutation was queued */
  timestamp: number
  /** Retry attempt count */
  retries: number
}

/** State from useOfflineSync */
export interface OfflineSyncState {
  /** Whether the REST API is reachable */
  isOnline: boolean
  /** Mutations waiting to sync */
  pendingCount: number
  /** Last successful sync timestamp */
  lastSyncAt: Date | null
}

/** DBAL client configuration */
export interface DBALClientConfig {
  /** Base URL for the REST API */
  baseUrl?: string
  /** Default tenant ID */
  tenant?: string
  /** Default package ID */
  packageId?: string
  /** Default request headers */
  headers?: Record<string, string>
  /** Request timeout (ms, default 30000) */
  timeoutMs?: number
  /** Network error callback */
  onRequestError?: (
    reason: 'offline' | 'timeout' | 'unknown'
  ) => void
}
