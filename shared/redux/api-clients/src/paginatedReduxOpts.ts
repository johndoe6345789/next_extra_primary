/**
 * Build Redux paginated options from async opts.
 */

/** @brief Normalize dependencies to array */
function normalizeDeps(
  deps: unknown
): unknown[] {
  if (!deps) return []
  return Array.isArray(deps)
    ? [...deps]
    : [deps]
}

/** @brief Async options with optional fields */
interface AsyncOpts {
  dependencies?: unknown
  retries?: number
  retryDelay?: number
  refetchOnFocus?: boolean
  refetchInterval?: number | null
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

/**
 * Build options object for useReduxPagImpl.
 * @param page - Current zero-based page
 * @param pageSize - Items per page
 * @param opts - Async options from caller
 * @returns Redux paginated options
 */
export function buildReduxPagOpts(
  page: number,
  pageSize: number,
  opts: AsyncOpts
) {
  return {
    pageSize,
    initialPage: page + 1,
    dependencies: normalizeDeps(opts.dependencies),
    maxRetries: opts.retries,
    retryDelay: opts.retryDelay,
    refetchOnFocus: opts.refetchOnFocus,
    refetchInterval:
      (opts.refetchInterval ?? null) ??
      undefined,
    onSuccess: opts.onSuccess as
      | ((data: unknown) => void)
      | undefined,
    onError: (error: string) => {
      opts.onError?.(new Error(error))
    },
  }
}
