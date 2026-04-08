import { useState, useCallback, useEffect } from 'react'
import type {
  MessageState,
  UseMessagesResult,
} from './messagesTypes'
import { useMessageOps } from './messagesOperations'

export type {
  Message,
  UseMessagesResult,
} from './messagesTypes'

/**
 * Hook for email message management
 * @param folderId - Folder to load messages from
 */
export function useMessages(
  folderId?: string
): UseMessagesResult {
  const [state, setState] =
    useState<MessageState>({
      messages: [],
      loading: true,
      error: null,
    })

  const ops = useMessageOps(setState)

  const refresh = useCallback(
    async (_folder?: string) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }))
      try {
        await new Promise((r) =>
          setTimeout(r, 500)
        )
        setState((prev) => ({
          ...prev,
          loading: false,
          messages: [],
        }))
      } catch (err) {
        const e =
          err instanceof Error
            ? err
            : new Error('Failed to load')
        setState((prev) => ({
          ...prev,
          loading: false,
          error: e,
        }))
      }
    },
    []
  )

  useEffect(() => {
    refresh(folderId)
  }, [folderId, refresh])

  return {
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    ...ops,
    refresh,
  }
}
