/**
 * useRegisterLogic Hook (Tier 2)
 * User registration with service adapter
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useServices } from '@shared/service-adapters'
import { setUILoading, setError } from '@shared/redux-slices'
import type { AppDispatch } from '@shared/redux-slices'
import type { RegistrationData } from './registerValidation'
import { validateRegistration } from './registerValidation'
import { persistAuthResult } from './authPersistence'

export type { RegistrationData } from './registerValidation'

/** @brief Return type for useRegisterLogic */
export interface UseRegisterLogicReturn {
  handleRegister: (
    data: RegistrationData
  ) => Promise<void>
}

/**
 * Registration hook with validation.
 * @example
 * const { handleRegister } = useRegisterLogic()
 */
export const useRegisterLogic =
  (): UseRegisterLogicReturn => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { authService } = useServices()

    const handleRegister = useCallback(
      async (data: RegistrationData) => {
        dispatch(setError(null))
        dispatch(setUILoading(true))
        try {
          const err = validateRegistration(data)
          if (err) throw new Error(err)

          const response =
            await authService.register(
              data.email,
              data.password,
              data.name
            )
          persistAuthResult(dispatch, response)
          router.push('/')
        } catch (error) {
          const msg =
            error instanceof Error
              ? error.message
              : 'Registration failed'
          dispatch(setError(msg))
          throw error
        } finally {
          dispatch(setUILoading(false))
        }
      },
      [dispatch, router, authService]
    )

    return { handleRegister }
  }

export default useRegisterLogic
