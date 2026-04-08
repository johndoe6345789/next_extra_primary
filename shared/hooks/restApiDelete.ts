'use client'

/**
 * REST API delete operation
 */

import { useCallback } from 'react'
import type { ApiResponse } from './restApiTypes'
import { handleApiError } from './restApiError'

export { useRestApiAction } from './restApiAction'

/** Create remove callback for REST API */
export function useRestApiRemove<T>(
  buildUrl: (
    entity: string,
    id?: string,
    action?: string,
    pkgOverride?: string
  ) => string,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  return useCallback(
    async (
      entity: string,
      id: string,
      opts?: { signal?: AbortSignal }
    ) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          buildUrl(entity, id),
          {
            method: 'DELETE',
            signal: opts?.signal,
          }
        )
        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status}: ` +
              res.statusText
          )
        }
        const json: ApiResponse<void> =
          await res.json()
        if (!json.success) {
          throw new Error(
            json.error ?? 'Request failed'
          )
        }
      } catch (err) {
        handleApiError(
          err,
          (m) => setError(m)
        )
      } finally {
        setLoading(false)
      }
    },
    [buildUrl, setLoading, setError]
  )
}
