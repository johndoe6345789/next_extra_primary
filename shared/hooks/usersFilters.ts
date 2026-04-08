'use client'

/**
 * User list filter/pagination callbacks
 */

import { useCallback } from 'react'

type FetchFn = (
  page?: number,
  limit?: number,
  search?: string,
  role?: string | null
) => Promise<void>

interface FiltersRef {
  current: {
    page: number
    limit: number
    search: string
    role: string | null
  }
}

/**
 * Build filter callbacks for useUsers
 * @param fetchUsers - Fetch function
 * @param filtersRef - Current filter state
 */
export function useUsersFilters(
  fetchUsers: FetchFn,
  filtersRef: FiltersRef
) {
  const filterByRole = useCallback(
    async (role: string | null) => {
      const { limit, search } =
        filtersRef.current
      await fetchUsers(1, limit, search, role)
    },
    [fetchUsers]
  )

  const changePage = useCallback(
    async (newPage: number) => {
      const { limit, search, role } =
        filtersRef.current
      await fetchUsers(
        newPage, limit, search, role
      )
    },
    [fetchUsers]
  )

  const changeLimit = useCallback(
    async (newLimit: number) => {
      const { search, role } =
        filtersRef.current
      await fetchUsers(
        1, newLimit, search, role
      )
    },
    [fetchUsers]
  )

  return { filterByRole, changePage, changeLimit }
}
