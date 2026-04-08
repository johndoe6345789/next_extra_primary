/**
 * useLoginLogic Hook (Tier 2)
 * User login business logic
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useServices } from '@shared/service-adapters'
import {
  setAuthenticated,
  setAuthLoading,
  setError,
} from '@shared/redux-slices'
import type {
  LoginData,
  UseLoginLogicReturn,
} from './loginLogicTypes'
import { validateLogin } from './loginLogicTypes'

export type {
  LoginData,
  UseLoginLogicReturn,
} from './loginLogicTypes'

/** Hook for user login */
export const useLoginLogic =
  (): UseLoginLogicReturn => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { authService } = useServices()

    const handleLogin = useCallback(
      async (data: LoginData) => {
        dispatch(setError(null))
        dispatch(setAuthLoading(true))
        try {
          const err = validateLogin(data)
          if (err) throw new Error(err)

          const response =
            await authService.login(
              data.email,
              data.password
            )

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
          router.push('/')
        } catch (error) {
          const msg =
            error instanceof Error
              ? error.message
              : 'Login failed'
          dispatch(setError(msg))
          throw error
        } finally {
          dispatch(setAuthLoading(false))
        }
      },
      [dispatch, router, authService]
    )

    return { handleLogin }
  }

export default useLoginLogic
