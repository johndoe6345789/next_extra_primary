/**
 * useStorageBackend Hook
 *
 * Manages storage backend selection and data ops.
 */

import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import type {
  StorageBackendType,
} from './unifiedStorageTypes'
import { getStorageAdapter } from './use-unified-storage'
import { useBackendSwitchers } from './storageBackendSwitchers'

/**
 * Hook for managing the storage backend
 */
export function useStorageBackend() {
  const [backend, setBackend] =
    useState<StorageBackendType | null>(null)
  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    let mounted = true
    const detect = async () => {
      try {
        const cur = await getStorageAdapter()
          .getBackend()
        if (mounted) setBackend(cur)
      } catch (err) {
        console.error(
          'Failed to detect storage backend:',
          err
        )
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    detect()
    return () => {
      mounted = false
    }
  }, [])

  const switchers = useBackendSwitchers(
    setBackend as (v: string) => void,
    setIsLoading
  )

  const exportData = useCallback(async () => {
    try {
      return await getStorageAdapter()
        .exportData()
    } catch (err) {
      console.error('Failed to export:', err)
      throw err
    }
  }, [])

  const importData = useCallback(
    async (data: Record<string, unknown>) => {
      setIsLoading(true)
      try {
        await getStorageAdapter()
          .importData(data)
      } catch (err) {
        console.error('Failed to import:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    backend,
    isLoading,
    ...switchers,
    exportData,
    importData,
  }
}
