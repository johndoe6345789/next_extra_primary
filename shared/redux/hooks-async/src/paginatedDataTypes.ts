/**
 * Paginated data hook type definitions
 */

import type { UseAsyncDataOptions } from
  './asyncDataTypes';

/** Paginated options */
export interface UsePaginatedOptions
  extends UseAsyncDataOptions {
  /** Items per page */
  pageSize?: number;
  /** Start page (default: 1) */
  initialPage?: number;
}

/** Paginated result */
export interface UsePaginatedResult<T = unknown> {
  data: T[];
  isLoading: boolean;
  isRefetching: boolean;
  error: string | null;
  retry: () => Promise<void>;
  refetch: () => Promise<void>;
  currentPage: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  totalPages?: number;
}
