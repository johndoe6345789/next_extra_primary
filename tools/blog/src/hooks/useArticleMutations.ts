'use client'

/**
 * useArticleMutations — wraps POST/PUT calls
 * against /api/blog/articles for the editor.
 * Refreshes the parent list on every success.
 */

import { useCallback } from 'react'

import type { Article } from './useArticles'

const API = '/api/blog/articles'

async function send(
  path: string,
  method: string,
  body?: unknown,
): Promise<Response> {
  return fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export function useArticleMutations(
  refresh: () => Promise<void>,
) {
  const createDraft = useCallback(async () => {
    const r = await send('', 'POST', {
      slug: `draft-${Date.now()}`,
      title: 'Untitled',
      body_md: '',
      status: 'draft',
    })
    if (!r.ok) return null
    const j = (await r.json()) as { id: number }
    await refresh()
    return j.id
  }, [refresh])

  const save = useCallback(
    async (a: Article) => {
      await send(`/${a.id}`, 'PUT', a)
      await refresh()
    },
    [refresh],
  )

  const publishNow = useCallback(
    async (a: Article) => {
      await send(`/${a.id}`, 'PUT', {
        ...a, status: 'published',
      })
      await refresh()
    },
    [refresh],
  )

  const schedule = useCallback(
    async (a: Article, when: string) => {
      await send(`/${a.id}`, 'PUT', {
        ...a, status: 'scheduled', scheduled_at: when,
      })
      await refresh()
    },
    [refresh],
  )

  return { createDraft, save, publishNow, schedule }
}
