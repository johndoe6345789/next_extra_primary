'use client'

/**
 * Shared error handler for REST API operations
 */

/** Handle API errors consistently */
export function handleApiError(
  err: unknown,
  setError: (msg: string) => void
) {
  if (
    err instanceof Error &&
    err.name === 'AbortError'
  ) {
    throw err
  }
  const msg =
    err instanceof Error
      ? err.message
      : 'Unknown error'
  setError(msg)
  throw err
}
