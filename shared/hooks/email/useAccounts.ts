import {
  useState,
  useCallback,
  useEffect,
} from 'react'
import type {
  AccountState,
  UseAccountsResult,
} from './accountsTypes'
import { useAccountOps } from './accountsOperations'

export type {
  EmailAccount,
  UseAccountsResult,
} from './accountsTypes'

/**
 * Hook for email account management
 */
export function useAccounts(): UseAccountsResult {
  const [state, setState] =
    useState<AccountState>({
      accounts: [],
      loading: true,
      error: null,
    })

  const ops = useAccountOps(setState)

  const refresh = useCallback(async () => {
    setState((p) => ({
      ...p,
      loading: true,
      error: null,
    }))
    try {
      await new Promise((r) =>
        setTimeout(r, 500)
      )
      setState((p) => ({
        ...p,
        loading: false,
        accounts:
          p.accounts.length === 0
            ? []
            : p.accounts,
      }))
    } catch (err) {
      const e =
        err instanceof Error
          ? err
          : new Error('Failed to load')
      setState((p) => ({
        ...p,
        loading: false,
        error: e,
      }))
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    accounts: state.accounts,
    loading: state.loading,
    error: state.error,
    ...ops,
    refresh,
  }
}
