'use client'

/**
 * REST API CRUD operations
 */

import { useCallback } from 'react'
import type { ApiResponse, RequestOptions } from './restApiTypes'
import { buildQueryString } from './restApiTypes'

/** Handle API errors consistently */
function handleApiError(err: unknown, setError: (msg: string) => void) {
  if (err instanceof Error && err.name === 'AbortError') throw err
  const msg = err instanceof Error ? err.message : 'Unknown error'
  setError(msg)
  throw err
}

/** Create CRUD operations for REST API */
export function useRestApiOperations<T>(
  buildUrl: (
    entity: string,
    id?: string,
    action?: string,
    pkgOverride?: string
  ) => string,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  const list = useCallback(
    async (entity: string, opts?: RequestOptions) => {
      setLoading(true); setError(null)
      try {
        const { packageId: pkg, signal, ...qOpts } = opts ?? {}
        const url = buildUrl(entity, undefined, undefined, pkg) + buildQueryString(qOpts as RequestOptions)
        const res = await fetch(url, { signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const json: ApiResponse<T[]> = await res.json()
        if (!json.success) throw new Error(json.error ?? 'Request failed')
        return json.data ?? []
      } catch (err) { handleApiError(err, (m) => setError(m)); return [] }
      finally { setLoading(false) }
    }, [buildUrl, setLoading, setError])

  const read = useCallback(
    async (entity: string, id: string, opts?: { signal?: AbortSignal }) => {
      setLoading(true); setError(null)
      try {
        const res = await fetch(buildUrl(entity, id), { signal: opts?.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const json: ApiResponse<T> = await res.json()
        if (!json.success) throw new Error(json.error ?? 'Request failed')
        return json.data ?? null
      } catch (err) { handleApiError(err, (m) => setError(m)); return null }
      finally { setLoading(false) }
    }, [buildUrl, setLoading, setError])

  const create = useCallback(
    async (entity: string, data: Record<string, unknown>, opts?: { signal?: AbortSignal }) => {
      setLoading(true); setError(null)
      try {
        const res = await fetch(buildUrl(entity), {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data), signal: opts?.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const json: ApiResponse<T> = await res.json()
        if (!json.success) throw new Error(json.error ?? 'Request failed')
        return json.data as T
      } catch (err) { handleApiError(err, (m) => setError(m)); return null as unknown as T }
      finally { setLoading(false) }
    }, [buildUrl, setLoading, setError])

  return { list, read, create }
}
