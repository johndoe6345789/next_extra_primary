'use client'

/**
 * REST API mutation operations
 * Composes from split operation files.
 */

import { useRestApiUpdate } from './restApiUpdate'
import { useRestApiRemove, useRestApiAction } from './restApiDelete'

export { handleApiError } from './restApiError'

/** Create mutation operations for REST API */
export function useRestApiMutations<T>(
  buildUrl: (
    entity: string,
    id?: string,
    action?: string,
    pkgOverride?: string
  ) => string,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  const update = useRestApiUpdate<T>(
    buildUrl, setLoading, setError
  )
  const remove = useRestApiRemove<T>(
    buildUrl, setLoading, setError
  )
  const action = useRestApiAction<T>(
    buildUrl, setLoading, setError
  )
  return { update, remove, action }
}
