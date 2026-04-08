/**
 * Async execution logic for useAsync hook
 */

import { useCallback, useRef, useEffect } from 'react'

interface AsyncSetters<T> {
  setData: (v: T | undefined) => void
  setLoading: (v: boolean) => void
  setError: (v: Error | undefined) => void
}

/**
 * Create the async execute callback
 * @param asyncFn - Function to execute
 * @param opts - Retry/reset options
 * @param setters - State setter functions
 */
export function useAsyncExecutor<T>(
  asyncFn: (...args: unknown[]) => Promise<T>,
  opts: {
    resetErrorOnRetry: boolean
    resetDataOnRetry: boolean
  },
  setters: AsyncSetters<T>
) {
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (
      ...args: unknown[]
    ): Promise<T | undefined> => {
      if (opts.resetErrorOnRetry) {
        setters.setError(undefined)
      }
      if (opts.resetDataOnRetry) {
        setters.setData(undefined)
      }
      setters.setLoading(true)
      try {
        const result = await asyncFn(...args)
        if (isMountedRef.current) {
          setters.setData(result)
          setters.setError(undefined)
          return result
        }
      } catch (err) {
        if (isMountedRef.current) {
          setters.setError(
            err instanceof Error
              ? err
              : new Error(String(err))
          )
          setters.setData(undefined)
        }
      } finally {
        if (isMountedRef.current) {
          setters.setLoading(false)
        }
      }
      return undefined
    },
    [
      asyncFn,
      opts.resetErrorOnRetry,
      opts.resetDataOnRetry,
      setters,
    ]
  )

  return { execute }
}
