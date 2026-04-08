'use client'

/**
 * Internal helpers for useBlobStorage
 */

import type { DBALClientConfig } from './types'
import { DBALError, DBALErrorCode } from './types'

/** Build blob endpoint URL */
export function buildBlobUrl(
  config: DBALClientConfig,
  key?: string
): string {
  const base = config.baseUrl ?? ''
  const tenant = config.tenant
  const pkg = config.packageId

  if (!tenant) {
    throw new DBALError(
      DBALErrorCode.VALIDATION_ERROR,
      'Tenant required for blob operations'
    )
  }
  if (!pkg) {
    throw new DBALError(
      DBALErrorCode.VALIDATION_ERROR,
      'Package required for blob operations'
    )
  }

  let url =
    `${base}/api/v1/${tenant}/${pkg}/blob`
  if (key) url += `/${encodeURIComponent(key)}`
  return url
}

/** Handle error response */
export async function handleError(
  response: Response
): Promise<never> {
  let message: string
  try {
    const json = await response.json()
    message =
      json.error ??
      json.message ??
      `HTTP ${response.status}`
  } catch {
    message =
      `HTTP ${response.status}: ` +
      response.statusText
  }
  throw DBALError.fromResponse(
    response.status,
    message
  )
}
