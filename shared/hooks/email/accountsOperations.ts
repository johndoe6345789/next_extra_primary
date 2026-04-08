/**
 * Account CRUD callbacks
 */

import { useCallback } from 'react'
import type {
  EmailAccount,
  AccountState,
} from './accountsTypes'

type SetState = React.Dispatch<
  React.SetStateAction<AccountState>
>

const delay = (ms: number) =>
  new Promise((r) => setTimeout(r, ms))

/** Create account mutation callbacks */
export function useAccountOps(
  setState: SetState
) {
  const addAccount = useCallback(
    async (
      account: Omit<
        EmailAccount,
        'id' | 'unreadCount' | 'totalCount'
      >
    ) => {
      try {
        await delay(500)
        const newAcc: EmailAccount = {
          ...account,
          id: `account_${Date.now()}`,
          unreadCount: 0,
          totalCount: 0,
        }
        setState((p) => ({
          ...p,
          accounts: [...p.accounts, newAcc],
        }))
        return newAcc
      } catch (err) {
        const e =
          err instanceof Error
            ? err
            : new Error('Failed to add')
        setState((p) => ({ ...p, error: e }))
        throw e
      }
    },
    [setState]
  )

  const deleteAccount = useCallback(
    async (id: string) => {
      try {
        await delay(500)
        setState((p) => ({
          ...p,
          accounts: p.accounts.filter(
            (a) => a.id !== id
          ),
        }))
      } catch (err) {
        const e =
          err instanceof Error
            ? err
            : new Error('Failed to delete')
        setState((p) => ({ ...p, error: e }))
        throw e
      }
    },
    [setState]
  )

  return { addAccount, deleteAccount }
}
