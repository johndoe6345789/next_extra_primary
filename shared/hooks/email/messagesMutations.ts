/**
 * Individual message mutation callbacks
 * (markSpam, delete, toggleStar)
 */

import { useCallback } from 'react'
import type { MessageState } from './messagesTypes'

type SetState = React.Dispatch<
  React.SetStateAction<MessageState>
>

const delay = (ms: number) =>
  new Promise((r) => setTimeout(r, ms))

/** Apply an update, wrapping errors */
export async function withError(
  setState: SetState,
  errMsg: string,
  fn: () => Promise<void>
) {
  try {
    await fn()
  } catch (err) {
    const e = err instanceof Error
      ? err
      : new Error(errMsg)
    setState((p) => ({ ...p, error: e }))
    throw e
  }
}

/** Spam-toggle and delete callbacks */
export function useMessageMutations(
  setState: SetState
) {
  const markSpam = useCallback(
    (id: string, isSpam: boolean) =>
      withError(setState, 'Failed to mark spam',
        async () => {
          await delay(300)
          setState((p) => ({
            ...p,
            messages: p.messages.map((m) =>
              m.id === id
                ? { ...m, isSpam } : m
            ),
          }))
        }),
    [setState]
  )

  const delete_ = useCallback(
    (id: string) =>
      withError(setState, 'Failed to delete',
        async () => {
          await delay(300)
          setState((p) => ({
            ...p,
            messages: p.messages.filter(
              (m) => m.id !== id
            ),
          }))
        }),
    [setState]
  )

  const toggleStar = useCallback(
    (id: string, isStarred: boolean) =>
      withError(setState, 'Failed to star',
        async () => {
          await delay(300)
          setState((p) => ({
            ...p,
            messages: p.messages.map((m) =>
              m.id === id
                ? { ...m, isStarred } : m
            ),
          }))
        }),
    [setState]
  )

  return { markSpam, delete: delete_, toggleStar }
}
