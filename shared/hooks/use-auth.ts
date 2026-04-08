/**
 * useAuth hook
 */

import { useEffect, useState } from 'react'
import { getSessionUser } from '@/lib/routing'
import type { AuthState } from './authTypes'
import { toAuthUser } from './authTypes'

export type {
  AuthUser,
  AuthState,
} from './authTypes'

/** Hook for authentication state */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const session = await getSessionUser()
        if (session.user !== null) {
          const user = toAuthUser(session.user)
          setState({
            user,
            isLoading: false,
            isAuthenticated: user !== null,
          })
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch {
        if (
          process.env.NODE_ENV === 'development'
        ) {
          console.error('Error loading user')
        }
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }
    void loadUser()
  }, [])

  return state
}
