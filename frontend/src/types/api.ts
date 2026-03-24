/**
 * Shared API response type definitions.
 * @module types/api
 */

/** Standardized API error shape. */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

/** Paginated list response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

/** Standard API response envelope. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
