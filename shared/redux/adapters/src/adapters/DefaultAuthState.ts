/**
 * DefaultAuthServiceAdapter - state methods
 *
 * Auth state accessors and persistence helpers
 * used by DefaultAuthServiceAdapter.
 */

import type { User, AuthResponse } from '../types'

/**
 * Mixin methods for auth state management.
 * Applied to DefaultAuthServiceAdapter via
 * prototype assignment.
 */

/** @brief Get current authenticated user */
export async function getCurrentUser(
  this: { user: User | null }
): Promise<User> {
  if (!this.user) {
    throw new Error('Not authenticated')
  }
  return this.user
}

/** @brief Check if user is authenticated */
export function isAuthenticated(
  this: {
    token: string | null
    user: User | null
  }
): boolean {
  return !!this.token && !!this.user
}

/** @brief Get current auth token */
export function getToken(
  this: { token: string | null }
): string | null {
  return this.token
}

/** @brief Get current user object */
export function getUser(
  this: { user: User | null }
): User | null {
  return this.user
}

/** @brief Persist auth data to state/storage */
export function persistAuth(
  this: {
    token: string | null
    user: User | null
  },
  data: AuthResponse
): void {
  this.token = data.token
  this.user = data.user
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      'auth_token', data.token
    )
    localStorage.setItem(
      'auth_user', JSON.stringify(data.user)
    )
  }
}

/** @brief Clear auth state and storage */
export function clearAuth(
  this: {
    token: string | null
    user: User | null
  }
): void {
  this.token = null
  this.user = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}
