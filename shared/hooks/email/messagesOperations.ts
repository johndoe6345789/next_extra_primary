/**
 * Message mutation callbacks
 */

import { useCallback } from 'react'
import type { MessageState } from './messagesTypes'
import {
  withError,
  useMessageMutations,
} from './messagesMutations'

type SetState = React.Dispatch<
  React.SetStateAction<MessageState>
>

const delay = (ms: number) =>
  new Promise((r) => setTimeout(r, ms))

/** Create message mutation callbacks */
export function useMessageOps(
  setState: SetState
) {
  const markRead = useCallback(
    (id: string, isRead: boolean) =>
      withError(setState, 'Failed to mark',
        async () => {
          await delay(300)
          setState((p) => ({
            ...p,
            messages: p.messages.map((m) =>
              m.id === id
                ? { ...m, isRead } : m
            ),
          }))
        }),
    [setState]
  )

  const mutations = useMessageMutations(
    setState
  )

  return {
    markRead,
    ...mutations,
  }
}
