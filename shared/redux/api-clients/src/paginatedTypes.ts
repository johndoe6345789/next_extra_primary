/**
 * Paginated Data Types
 * Types for the usePaginatedData hook
 */

import type {
  UseAsyncDataOptions,
  UseAsyncDataResult,
} from './asyncDataBaseTypes'

/** @brief Options for usePaginatedData */
export interface UsePaginatedDataOptions<T>
  extends UseAsyncDataOptions<T[]> {
  /** Items per page @default 10 */
  pageSize?: number
  /** Initial page (0-based) @default 0 */
  initialPage?: number
}

/** @brief Result of usePaginatedData */
export interface UsePaginatedDataResult<T>
  extends UseAsyncDataResult<T[]> {
  page: number
  pageCount: number
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  itemCount: number
}
