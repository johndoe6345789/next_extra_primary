/**
 * useLoginLogic Hook (Tier 2)
 * User login with service adapter injection
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useServices } from '@shared/service-adapters'
import { setUILoading, setError } from '@shared/redux-slices'
import type { AppDispatch } from '@shared/redux-slices'
import type { LoginData } from './loginValidation'
import { validateLogin } from './loginValidation'
import { persistAuthResult } from './authPersistence'

export type { LoginData } from './loginValidation'

/** @brief Return type for useLoginLogic */
export interface UseLoginLogicReturn {
  handleLogin: (
    data: LoginData
  ) => Promise<void>
}

/**
 * Login hook with validation.
 * @example
 * const { handleLogin } = useLoginLogic()
 */
export const useLoginLogic =
  (): UseLoginLogicReturn => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { authService } = useServices()

    const handleLogin = useCallback(
      async (data: LoginData) => {
        dispatch(setError(null))
        dispatch(setUILoading(true))
        try {
          const err = validateLogin(data)
          if (err) throw new Error(err)

          const response =
            await authService.login(
              data.email,
              data.password
            )
          persistAuthResult(dispatch, response)
          router.push('/')
        } catch (error) {
          const msg =
            error instanceof Error
              ? error.message
              : 'Login failed'
          dispatch(setError(msg))
          throw error
        } finally {
          dispatch(setUILoading(false))
        }
      },
      [dispatch, router, authService]
    )

    return { handleLogin }
  }

export default useLoginLogic
