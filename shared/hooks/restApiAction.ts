'use client'

/**
 * REST API action (POST) operation
 */

import { useCallback } from 'react'
import type { ApiResponse } from './restApiTypes'
import { handleApiError } from './restApiError'

/** Create action callback for REST API */
export function useRestApiAction<T>(
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
      actionName: string,
      data?: Record<string, unknown>,
      opts?: { signal?: AbortSignal }
    ) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          buildUrl(entity, id, actionName),
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body:
              data !== undefined
                ? JSON.stringify(data)
                : undefined,
            signal: opts?.signal,
          }
        )
        if (!res.ok) {
          throw new Error(
            `HTTP ${res.status}: ` +
              res.statusText
          )
        }
        const json: ApiResponse<T> =
          await res.json()
        if (!json.success) {
          throw new Error(
            json.error ?? 'Request failed'
          )
        }
        return json.data as T
      } catch (err) {
        handleApiError(
          err,
          (m) => setError(m)
        )
        return null as unknown as T
      } finally {
        setLoading(false)
      }
    },
    [buildUrl, setLoading, setError]
  )
}
