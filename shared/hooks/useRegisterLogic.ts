/**
 * useRegisterLogic Hook (Tier 2)
 * User registration business logic
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
  RegistrationData,
  UseRegisterLogicReturn,
} from './registerLogicValidation'
import {
  validateRegistration,
} from './registerLogicValidation'

export type {
  RegistrationData,
  UseRegisterLogicReturn,
} from './registerLogicValidation'

/**
 * Hook for user registration
 */
export const useRegisterLogic =
  (): UseRegisterLogicReturn => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { authService } = useServices()

    const handleRegister = useCallback(
      async (data: RegistrationData) => {
        dispatch(setError(null))
        dispatch(setAuthLoading(true))
        try {
          const err =
            validateRegistration(data)
          if (err) throw new Error(err)

          const response =
            await authService.register(
              data.email,
              data.password,
              data.name
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
              : 'Registration failed'
          dispatch(setError(msg))
          throw error
        } finally {
          dispatch(setAuthLoading(false))
        }
      },
      [dispatch, router, authService]
    )

    return { handleRegister }
  }

export default useRegisterLogic
