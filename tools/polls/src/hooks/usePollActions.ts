'use client'

/**
 * Mutation hook for the polls operator tool.
 * Wraps POST /api/polls and /api/polls/{id}/vote
 * so the UI components stay presentational.
 */

import { useCallback } from 'react'
import type { PollKind } from './usePolls'

const API = '/api/polls'

export interface CreatePollInput {
  question: string
  kind: PollKind
  closes_at: string
  options: string[]
  tenant_id: string
}

export interface VoteInput {
  option_id: number
  rank?: number
  weight?: number
}

export function usePollActions(
  onChanged: () => void,
) {
  const create = useCallback(
    async (input: CreatePollInput) => {
      const body = {
        question: input.question,
        kind: input.kind,
        closes_at: input.closes_at,
        tenant_id: input.tenant_id,
        options: input.options.map(l => ({
          label: l,
        })),
      }
      const r = await fetch(API, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (r.ok) onChanged()
      return r.ok
    },
    [onChanged],
  )

  const vote = useCallback(
    async (id: number, input: VoteInput) => {
      const r = await fetch(
        `${API}/${id}/vote`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(input),
        },
      )
      if (r.ok) onChanged()
      return r.ok
    },
    [onChanged],
  )

  return { create, vote }
}
