'use client'

/**
 * Package fetch request builder and executor
 */

import type {
  PackageInfo,
  PackageListState,
  PackageError,
  PaginatedResponse,
  PackageStatus,
} from '@/lib/types/package-admin-types'
import { PackageErrorCode } from '@/lib/types/package-admin-types'
import { parseApiError } from './packagesHelpers'

/**
 * Build URL params and execute fetch
 * @param baseUrl - API base URL
 * @param page - Page number
 * @param limit - Items per page
 * @param search - Search term
 * @param status - Status filter
 * @param signal - Abort signal
 */
export async function fetchPackageData(
  baseUrl: string,
  page: number,
  limit: number,
  search: string,
  status: PackageStatus,
  signal: AbortSignal
): Promise<{
  data: PaginatedResponse<PackageInfo> | null
  error: PackageError | null
}> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
    ...(status !== 'all' && { status }),
  })

  const res = await fetch(
    `${baseUrl}/api/admin/packages?${params}`,
    { signal }
  )

  if (!res.ok) {
    const error = await parseApiError(res)
    return { data: null, error }
  }

  const data = (await res.json()) as
    PaginatedResponse<PackageInfo>
  return { data, error: null }
}

/** Wrap a caught error as a PackageError */
export function wrapNetworkError(
  err: unknown
): PackageError {
  const error =
    err instanceof Error
      ? err
      : new Error(String(err))
  const pkgError = error as PackageError
  pkgError.code = PackageErrorCode.NETWORK_ERROR
  pkgError.name = 'PackageError'
  return pkgError
}
