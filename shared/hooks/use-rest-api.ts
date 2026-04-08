'use client'

/**
 * useRestApi Hook
 *
 * React hook for making RESTful API calls using
 * the tenant routing pattern.
 */

import { useState, useCallback } from 'react'
import { useTenantOptional } from '@/app/[tenant]/[package]/tenant-context'
import type { UseRestApiOptions } from './restApiTypes'
import { useRestApiOperations } from './restApiOperations'
import { useRestApiMutations } from './restApiMutations'

export { useEntity, useDependencyEntity } from './restApiEntity'

/** Hook for making REST API calls */
export function useRestApi<T = unknown>(
  options?: UseRestApiOptions
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<string | null>(null)

  const tenantContext = useTenantOptional()
  const tenant =
    options?.tenant ?? tenantContext?.tenant
  const defaultPackageId =
    options?.packageId ?? tenantContext?.packageId

  /** Build the base URL for API calls */
  const buildUrl = useCallback(
    (
      entity: string,
      id?: string,
      action?: string,
      pkgOverride?: string
    ) => {
      if (!tenant) {
        throw new Error('Tenant is required')
      }
      const pkg = pkgOverride ?? defaultPackageId
      if (!pkg) {
        throw new Error('Package is required')
      }
      let url = `/api/v1/${tenant}/${pkg}/${entity}`
      if (id) url += `/${id}`
      if (action) url += `/${action}`
      return url
    },
    [tenant, defaultPackageId]
  )

  const ops = useRestApiOperations<T>(
    buildUrl, setLoading, setError
  )
  const muts = useRestApiMutations<T>(
    buildUrl, setLoading, setError
  )

  return {
    loading, error, buildUrl,
    ...ops, ...muts,
  }
}
