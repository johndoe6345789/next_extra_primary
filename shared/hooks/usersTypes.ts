/**
 * Type definitions for useUsers hook
 */

import type { User } from '@/lib/level-types'

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UseUsersState {
  users: User[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  search: string
  roleFilter: string | null
  refetching: boolean
}

export interface UseUsersHandlers {
  fetchUsers: (
    page?: number,
    limit?: number,
    search?: string,
    role?: string | null
  ) => Promise<void>
  refetchUsers: () => Promise<void>
  searchUsers: (term: string) => Promise<void>
  filterByRole: (
    role: string | null
  ) => Promise<void>
  changePage: (newPage: number) => Promise<void>
  changeLimit: (newLimit: number) => Promise<void>
  reset: () => void
}

export interface UseUsersReturn extends UseUsersState {
  handlers: UseUsersHandlers
}

/** Default initial state */
export const DEFAULT_USERS_STATE: UseUsersState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  search: '',
  roleFilter: null,
  refetching: false,
}
