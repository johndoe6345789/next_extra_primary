'use client'

/**
 * Internal helpers for useKVStore
 */

import type { DBALClientConfig } from './types'
import { DBALError, DBALErrorCode } from './types'

/** Build KV endpoint URL */
export function buildKVUrl(
  config: DBALClientConfig,
  key?: string
): string {
  const base = config.baseUrl ?? ''
  const tenant = config.tenant
  const pkg = config.packageId

  if (!tenant) {
    throw new DBALError(
      DBALErrorCode.VALIDATION_ERROR,
      'Tenant is required for KV operations'
    )
  }
  if (!pkg) {
    throw new DBALError(
      DBALErrorCode.VALIDATION_ERROR,
      'Package is required for KV operations'
    )
  }

  let url = `${base}/api/v1/${tenant}/${pkg}/kv`
  if (key) url += `/${encodeURIComponent(key)}`
  return url
}

/** Fetch JSON with error handling */
export async function jsonFetch<T>(
  url: string,
  init: RequestInit,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extraHeaders,
  }

  const response = await fetch(url, {
    ...init,
    headers,
  })

  if (!response.ok) {
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

  const ct =
    response.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    const json = await response.json()
    return json.data !== undefined
      ? json.data
      : json
  }

  return undefined as unknown as T
}
