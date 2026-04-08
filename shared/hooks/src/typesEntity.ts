/**
 * Entity and list types for DBAL REST API
 */

export type EntityId = string

/** Base entity with timestamps */
export interface BaseEntity {
  id: EntityId
  createdAt: string
  updatedAt: string
}

/** Entity with soft-delete support */
export interface SoftDeletableEntity
  extends BaseEntity {
  deletedAt?: string
}

/** Tenant-scoped entity */
export interface TenantScopedEntity
  extends BaseEntity {
  tenantId?: string | null
}

/** Options for list/query operations */
export interface ListOptions {
  filter?: Record<string, unknown>
  sort?: Record<string, 'asc' | 'desc'>
  page?: number
  limit?: number
}

/** Paginated list result */
export interface ListResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

/** Bulk create result */
export interface BulkCreateResult {
  created: number
}

/** Bulk update result */
export interface BulkUpdateResult {
  updated: number
}

/** Bulk delete result */
export interface BulkDeleteResult {
  deleted: number
}
