'use client'

/**
 * API health check for offline sync
 */

import { HEALTH_TIMEOUT_MS } from './offlineSyncTypes'

/**
 * Check if the REST API health endpoint is
 * reachable within the configured timeout.
 */
export async function checkApiHealth(
  baseUrl: string
): Promise<boolean> {
  const url = `${baseUrl}/health`
  const ctrl = new AbortController()
  const tid = setTimeout(
    () => ctrl.abort(),
    HEALTH_TIMEOUT_MS
  )
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(tid)
  }
}
