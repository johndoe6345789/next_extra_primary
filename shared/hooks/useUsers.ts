'use client'

/**
 * useUsers Hook
 *
 * Manages user list state, pagination,
 * search, and filtering.
 */

import { useCallback, useRef, useState } from 'react'
import type { UseUsersReturn } from './usersTypes'
import { DEFAULT_USERS_STATE } from './usersTypes'
import { useUsersFetch } from './usersFetch'
import { useUsersFilters } from './usersFilters'

let searchTimeout: NodeJS.Timeout | null = null

/** Hook for managing user list state */
export function useUsers(
  options?: { baseUrl?: string }
): UseUsersReturn {
  const baseUrl = options?.baseUrl ?? ''
  const [state, setState] = useState(
    DEFAULT_USERS_STATE
  )

  const filtersRef = useRef({
    page: 1, limit: 10,
    search: '', role: null as string | null,
  })

  const fetchUsers = useUsersFetch(
    baseUrl, setState, filtersRef
  )

  const refetchUsers = useCallback(async () => {
    setState((p) => ({ ...p, refetching: true }))
    try {
      const { page, limit, search, role } =
        filtersRef.current
      await fetchUsers(
        page, limit, search, role
      )
    } finally {
      setState((p) => ({
        ...p, refetching: false,
      }))
    }
  }, [fetchUsers])

  const searchUsers = useCallback(
    async (term: string) => {
      if (searchTimeout)
        clearTimeout(searchTimeout)
      setState((p) => ({ ...p, search: term }))
      searchTimeout = setTimeout(async () => {
        const { limit, role } =
          filtersRef.current
        await fetchUsers(1, limit, term, role)
      }, 300)
    },
    [fetchUsers]
  )

  const filters = useUsersFilters(
    fetchUsers, filtersRef
  )

  const reset = useCallback(() => {
    setState(DEFAULT_USERS_STATE)
    filtersRef.current = {
      page: 1, limit: 10,
      search: '', role: null,
    }
  }, [])

  return {
    ...state,
    handlers: {
      fetchUsers, refetchUsers, searchUsers,
      ...filters, reset,
    },
  }
}

export default useUsers
