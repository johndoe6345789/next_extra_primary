/**
 * Auth Persistence Helpers
 * Shared logic for persisting auth state
 * to localStorage and Redux.
 */

import type { AppDispatch } from '@shared/redux-slices'
import { setAuthenticated } from '@shared/redux-slices'

/** @brief Auth response shape */
interface AuthResult {
  token: string
  user: { id: string; email: string; name: string }
}

/**
 * Persist auth to localStorage and Redux
 * @param dispatch - Redux dispatch
 * @param response - Auth response
 */
export function persistAuthResult(
  dispatch: AppDispatch,
  response: AuthResult
): void {
  localStorage.setItem(
    'auth_token',
    response.token
  )
  localStorage.setItem(
    'current_user',
    JSON.stringify(response.user)
  )
  dispatch(
    setAuthenticated({
      user: response.user,
      token: response.token,
    })
  )
}
