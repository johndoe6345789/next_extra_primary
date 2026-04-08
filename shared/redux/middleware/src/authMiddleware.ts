/**
 * Redux Middleware for Authentication
 * Handles session restoration from storage
 */

import { Middleware, UnknownAction } from '@reduxjs/toolkit'

export { initAuthInterceptor } from './authInterceptor'

/** @brief Action for restoring auth */
type RestoreFromStorageAction = UnknownAction & {
  type: 'auth/restoreFromStorage'
  payload: { token: string; user: any }
}

/**
 * Creates auth middleware with provided
 * restore action creator.
 * @param restoreFromStorage - Action creator
 * @returns Redux middleware
 */
export function createAuthMiddleware(
  restoreFromStorage: (
    payload: { token: string; user: any }
  ) => RestoreFromStorageAction
): Middleware {
  return (store) => (next) => (action: any) => {
    if (
      (action.type === '@@INIT' ||
        action.type ===
          'auth/restoreFromStorage') &&
      typeof window !== 'undefined'
    ) {
      try {
        const token =
          localStorage.getItem('auth_token')
        const userStr =
          localStorage.getItem('current_user')
        if (token && userStr) {
          const user = JSON.parse(userStr)
          store.dispatch(
            restoreFromStorage({ token, user })
          )
        }
      } catch (error) {
        console.error(
          'Failed to restore auth session:',
          error
        )
      }
    }
    return next(action)
  }
}

/**
 * Legacy auth middleware
 * @deprecated Use createAuthMiddleware
 */
export const authMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    if (
      (action.type === '@@INIT' ||
        action.type ===
          'auth/restoreFromStorage') &&
      typeof window !== 'undefined'
    ) {
      try {
        const token =
          localStorage.getItem('auth_token')
        const userStr =
          localStorage.getItem('current_user')
        if (token && userStr) {
          const user = JSON.parse(userStr)
          store.dispatch({
            type: 'auth/restoreFromStorage',
            payload: { token, user },
          })
        }
      } catch (error) {
        console.error(
          'Failed to restore auth session:',
          error
        )
      }
    }
    return next(action)
  }
