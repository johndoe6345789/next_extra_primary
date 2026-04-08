'use client'

/**
 * Fetch logic for useUsers hook
 */

import { useCallback } from 'react'
import type { UseUsersState } from './usersTypes'
import { executeUsersFetch } from './usersFetchRequest'

/** Build query string for users API */
export function buildUsersQueryString(
  page: number,
  limit: number,
  search?: string,
  role?: string | null
): string {
  const params = new URLSearchParams()
  params.set('skip', String((page - 1) * limit))
  params.set('take', String(limit))
  if (search && search.trim()) {
    params.set('search', search.trim())
  }
  if (role) params.set('role', role)
  return `?${params.toString()}`
}

/** Create fetchUsers callback */
export function useUsersFetch(
  baseUrl: string,
  setState: React.Dispatch<
    React.SetStateAction<UseUsersState>
  >,
  currentFiltersRef: React.MutableRefObject<{
    page: number
    limit: number
    search: string
    role: string | null
  }>
) {
  return useCallback(
    async (
      page = 1,
      limit = 10,
      search = '',
      role: string | null = null
    ) => {
      setState((p) => ({
        ...p, loading: true, error: null,
      }))

      try {
        currentFiltersRef.current = {
          page, limit, search, role,
        }

        await executeUsersFetch(
          baseUrl, page, limit,
          search, role, setState
        )
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to fetch users'
        setState((p) => ({
          ...p, error: msg, loading: false,
        }))
      }
    },
    [baseUrl, setState, currentFiltersRef]
  )
}
