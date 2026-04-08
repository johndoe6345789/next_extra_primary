/**
 * Type definitions for useRestApi hook
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface UseRestApiOptions {
  tenant?: string
  packageId?: string
}

export interface RequestOptions {
  take?: number
  skip?: number
  where?: Record<string, unknown>
  orderBy?: Record<string, 'asc' | 'desc'>
  /** Override package for this request */
  packageId?: string
  /** AbortSignal for cancelling */
  signal?: AbortSignal
}

/**
 * Build query string from options
 */
export function buildQueryString(
  options: RequestOptions
): string {
  const params = new URLSearchParams()

  if (options.take !== undefined) {
    params.set('take', String(options.take))
  }
  if (options.skip !== undefined) {
    params.set('skip', String(options.skip))
  }

  if (options.where !== undefined) {
    for (const [key, value] of Object.entries(
      options.where
    )) {
      params.set(`where.${key}`, String(value))
    }
  }

  if (options.orderBy !== undefined) {
    for (const [key, value] of Object.entries(
      options.orderBy
    )) {
      params.set(`orderBy.${key}`, value)
    }
  }

  const query = params.toString()
  return query.length > 0 ? `?${query}` : ''
}
