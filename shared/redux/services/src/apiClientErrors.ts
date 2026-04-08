/**
 * API error types and helper functions
 */

/** API error shape */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** API response wrapper */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  status: number;
}

/** Check if error is an ApiError */
export function isApiError(
  error: unknown
): error is ApiError {
  return typeof error === 'object' &&
    error !== null &&
    'code' in error && 'message' in error;
}

/** Get a human-readable error message */
export function getErrorMessage(
  error: unknown
): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
