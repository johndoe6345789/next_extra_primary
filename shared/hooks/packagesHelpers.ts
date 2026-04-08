'use client'

/**
 * Helper functions for usePackages hook
 */

import type {
  PackageError,
} from '@/lib/types/package-admin-types'
import { PackageErrorCode } from '@/lib/types/package-admin-types'

/**
 * Create a structured PackageError from API response
 */
export function createPackageError(
  statusCode: number,
  response: Record<string, unknown>
): PackageError {
  const message =
    (response.message as string) || 'Unknown error'
  const code =
    (response.code as PackageErrorCode) ||
    PackageErrorCode.UNKNOWN_ERROR
  const details =
    (response.details as Record<string, unknown>) ||
    {}

  const error = new Error(message) as PackageError
  error.code = code
  error.statusCode = statusCode
  error.details = details
  error.name = 'PackageError'

  return error
}

/**
 * Parse API error response
 */
export async function parseApiError(
  response: Response
): Promise<PackageError> {
  try {
    const data = (await response.json()) as Record<
      string,
      unknown
    >
    return createPackageError(response.status, data)
  } catch {
    const error = new Error(
      `HTTP ${response.status}: ${response.statusText}`
    ) as PackageError
    error.code = PackageErrorCode.NETWORK_ERROR
    error.statusCode = response.status
    error.name = 'PackageError'
    return error
  }
}
