/**
 * useMutation - Write operations with state
 *
 * Delegates to Redux-backed @shared/hooks-async.
 */

import {
  useReduxMutation as useReduxMutImpl,
} from '@shared/hooks-async'
import type {
  UseMutationOptions,
  UseMutationResult,
} from './asyncDataTypes'

/**
 * Hook for mutations (POST, PUT, DELETE)
 * with loading state and error handling.
 *
 * @template T Input data type
 * @template R Return type
 * @param mutationFn - Executes the mutation
 * @param options - Configuration options
 * @returns Mutation executor and state
 */
export function useMutation<T, R>(
  mutationFn: (data: T) => Promise<R>,
  options: UseMutationOptions<T, R> = {}
): UseMutationResult<T, R> {
  const { onSuccess, onError } = options

  const reduxResult = useReduxMutImpl<T, R>(
    mutationFn,
    {
      onSuccess,
      onError: (error: string) => {
        onError?.(new Error(error))
      },
    }
  )

  return {
    mutate: reduxResult.mutate,
    isLoading: reduxResult.isLoading,
    error: reduxResult.error
      ? new Error(reduxResult.error)
      : null,
    reset: reduxResult.reset,
  }
}
