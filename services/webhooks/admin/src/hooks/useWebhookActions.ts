'use client'

/**
 * Webhook action helpers — create /
 * update / delete endpoints and replay
 * failed deliveries.  Each call hits
 * the dispatcher REST API and invokes
 * the supplied refresh callback on
 * success so the UI stays live.
 */

import { useCallback } from 'react'

const API = '/api/webhooks'

export interface EndpointInput {
  url: string
  secret: string
  events: string[]
  active: boolean
}

export function useWebhookActions(
  refresh: () => void,
) {
  const create = useCallback(
    async (input: EndpointInput) => {
      const r = await fetch(
        `${API}/endpoints`,
        {
          method: 'POST',
          headers: {
            'content-type':
              'application/json',
          },
          body: JSON.stringify(input),
        },
      )
      if (r.ok) refresh()
      return r.ok
    },
    [refresh],
  )

  const update = useCallback(
    async (
      id: number,
      input: Partial<EndpointInput>,
    ) => {
      const r = await fetch(
        `${API}/endpoints/${id}`,
        {
          method: 'PUT',
          headers: {
            'content-type':
              'application/json',
          },
          body: JSON.stringify(input),
        },
      )
      if (r.ok) refresh()
      return r.ok
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: number) => {
      const r = await fetch(
        `${API}/endpoints/${id}`,
        { method: 'DELETE' },
      )
      if (r.ok) refresh()
      return r.ok
    },
    [refresh],
  )

  const replay = useCallback(
    async (id: number) => {
      const r = await fetch(
        `${API}/deliveries/${id}/replay`,
        { method: 'POST' },
      )
      if (r.ok) refresh()
      return r.ok
    },
    [refresh],
  )

  return { create, update, remove, replay }
}
