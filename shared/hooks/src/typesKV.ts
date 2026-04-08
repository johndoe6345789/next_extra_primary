/**
 * KV store types for DBAL REST API
 */

/** A value storable in KV */
export type StorableValue =
  | string
  | number
  | boolean
  | null
  | object
  | StorableValue[]

/** A single KV entry */
export interface KVEntry {
  key: string
  value: StorableValue
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'null'
    | 'object'
    | 'array'
  sizeBytes: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

/** Options for listing KV entries */
export interface KVListOptions {
  prefix?: string
  limit?: number
  cursor?: string
}

/** KV list result */
export interface KVListResult {
  entries: KVEntry[]
  nextCursor?: string
  hasMore: boolean
}
