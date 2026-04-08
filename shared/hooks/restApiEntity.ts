'use client'

/**
 * Entity-specific and dependency entity hooks
 */

import type { RequestOptions, UseRestApiOptions } from './restApiTypes'
import { useRestApi } from './use-rest-api'
import { useTenantOptional } from '@/app/[tenant]/[package]/tenant-context'

/**
 * Hook for a specific entity type
 */
export function useEntity<T = unknown>(
  entity: string,
  options?: UseRestApiOptions
) {
  const api = useRestApi<T>(options)

  return {
    loading: api.loading,
    error: api.error,
    list: (opts?: RequestOptions) =>
      api.list(entity, opts),
    read: (id: string) => api.read(entity, id),
    create: (data: Record<string, unknown>) =>
      api.create(entity, data),
    update: (
      id: string,
      data: Record<string, unknown>
    ) => api.update(entity, id, data),
    remove: (id: string) =>
      api.remove(entity, id),
    action: (
      id: string,
      actionName: string,
      data?: Record<string, unknown>
    ) => api.action(entity, id, actionName, data),
  }
}

/**
 * Hook for accessing entities from a dependency
 * package.
 *
 * @example
 * const { list: listRoles } =
 *   useDependencyEntity<Role>(
 *     'user_manager', 'roles'
 *   )
 */
export function useDependencyEntity<T = unknown>(
  packageId: string,
  entity: string
) {
  const ctx = useTenantOptional()

  if (ctx && !ctx.hasPackage(packageId)) {
    console.warn(
      `Package '${packageId}' is not accessible ` +
      `from '${ctx.primaryPackage}'. Add it to ` +
      `dependencies in metadata.json.`
    )
  }

  const api = useRestApi<T>({ packageId })

  return {
    loading: api.loading,
    error: api.error,
    list: (
      opts?: Omit<RequestOptions, 'packageId'>
    ) => api.list(entity, opts),
    read: (id: string) => api.read(entity, id),
    create: (data: Record<string, unknown>) =>
      api.create(entity, data),
    update: (
      id: string,
      data: Record<string, unknown>
    ) => api.update(entity, id, data),
    remove: (id: string) =>
      api.remove(entity, id),
    action: (
      id: string,
      actionName: string,
      data?: Record<string, unknown>
    ) => api.action(entity, id, actionName, data),
  }
}
