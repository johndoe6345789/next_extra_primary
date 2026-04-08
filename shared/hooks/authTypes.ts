/**
 * Type definitions and helpers for use-auth
 */

/** Authenticated user */
export interface AuthUser {
  id: string
  username: string
  email: string
  role: string
  level: number
  tenantId?: string
}

/** Authentication state */
export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

/**
 * Parse a raw record into AuthUser
 * @returns AuthUser or null if invalid
 */
export const toAuthUser = (
  value: Record<string, unknown>
): AuthUser | null => {
  const { id, username, email, role, level } =
    value

  if (
    typeof id !== 'string' ||
    typeof username !== 'string' ||
    typeof email !== 'string' ||
    typeof role !== 'string'
  ) {
    return null
  }

  let resolvedLevel = 0
  if (typeof level === 'number') {
    resolvedLevel = level
  } else if (typeof level === 'bigint') {
    resolvedLevel = Number(level)
  }

  return {
    id,
    username,
    email,
    role,
    level: resolvedLevel,
  }
}
