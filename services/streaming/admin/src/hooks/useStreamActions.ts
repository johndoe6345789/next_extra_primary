'use client'

/**
 * useStreamActions — mutating calls against
 * /api/streams/{id}/block, /kick and DELETE.
 * Every action triggers the supplied refresh
 * callback so the list reflects reality
 * without the 5-second poll delay.
 */

import { useCallback } from 'react'

const API = '/api/streams'

async function post(
  path: string,
): Promise<boolean> {
  try {
    const r = await fetch(`${API}${path}`, {
      method: 'POST',
    })
    return r.ok
  } catch {
    return false
  }
}

async function del(
  path: string,
): Promise<boolean> {
  try {
    const r = await fetch(`${API}${path}`, {
      method: 'DELETE',
    })
    return r.ok
  } catch {
    return false
  }
}

export function useStreamActions(
  refresh: () => void,
) {
  const block = useCallback(
    async (id: number) => {
      await post(`/${id}/block`)
      refresh()
    },
    [refresh],
  )
  const kick = useCallback(
    async (id: number) => {
      await post(`/${id}/kick`)
      refresh()
    },
    [refresh],
  )
  const remove = useCallback(
    async (id: number) => {
      await del(`/${id}`)
      refresh()
    },
    [refresh],
  )
  return { block, kick, remove }
}
