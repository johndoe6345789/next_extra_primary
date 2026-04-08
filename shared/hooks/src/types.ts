/**
 * Shared types for DBAL REST API hooks
 *
 * Re-exports from domain-specific type files.
 */

export type {
  EntityId,
  BaseEntity,
  SoftDeletableEntity,
  TenantScopedEntity,
  ListOptions,
  ListResult,
  BulkCreateResult,
  BulkUpdateResult,
  BulkDeleteResult,
} from './typesEntity'

export {
  DBALErrorCode,
  DBALError,
} from './typesApi'
export type { ApiResponse } from './typesApi'

export type {
  BlobMetadata,
  BlobListResult,
  BlobListOptions,
  BlobUploadOptions,
} from './typesBlob'

export type {
  StorableValue,
  KVEntry,
  KVListOptions,
  KVListResult,
} from './typesKV'

export type {
  AsyncState,
  SyncStatus,
  SyncQueueEntry,
  OfflineSyncState,
  DBALClientConfig,
} from './typesSync'
