'use client'

/**
 * HTTP request logic for users fetch
 */

import type { UseUsersState } from './usersTypes'
import { buildUsersQueryString } from './usersFetch'

type SetState = React.Dispatch<
  React.SetStateAction<UseUsersState>
>

/**
 * Execute the users API request
 * @param baseUrl - API base URL
 * @param page - Page number
 * @param limit - Items per page
 * @param search - Search term
 * @param role - Role filter
 * @param setState - State setter
 */
export async function executeUsersFetch(
  baseUrl: string,
  page: number,
  limit: number,
  search: string,
  role: string | null,
  setState: SetState
): Promise<void> {
  const qs = buildUsersQueryString(
    page, limit, search, role
  )
  const res = await fetch(
    `${baseUrl}/api/v1/default/` +
    `user_manager/users${qs}`
  )

  if (!res.ok) {
    const errData = await res.json()
      .catch(() => ({}))
    throw new Error(
      (
        errData as Record<
          string,
          Record<string, string>
        >
      ).error?.message ||
      `HTTP ${res.status}: ${res.statusText}`
    )
  }

  const data = await res.json()
  const total = data.meta?.total ?? 0
  const totalPages = Math.ceil(total / limit)

  setState((p) => ({
    ...p,
    users: data.data ?? [],
    pagination: {
      page, limit, total, totalPages,
    },
    search, roleFilter: role, loading: false,
  }))
}
