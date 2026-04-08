/**
 * Core package administration types
 */

/** Package error codes */
export enum PackageErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

/** Package status filter */
export type PackageStatus =
  | 'all'
  | 'installed'
  | 'available'
  | 'enabled'
  | 'disabled'

/** Package information */
export interface PackageInfo {
  id: string
  name: string
  version: string
  description?: string
  status?: PackageStatus
  enabled?: boolean
  installed?: boolean
  dependencies?: string[]
  [key: string]: unknown
}

/** Package error */
export interface PackageError extends Error {
  code: PackageErrorCode
  statusCode?: number
  details?: Record<string, unknown>
}

/** Paginated response */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
