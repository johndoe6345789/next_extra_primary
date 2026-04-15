'use client'

/**
 * useArticles — polls /api/blog/articles and
 * exposes the current list plus a refresh
 * callback.  Uses plain fetch because the
 * operator tools deliberately avoid RTK
 * Query to keep bundle size small.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/blog'
const POLL_MS = 15_000

/** Mirror of the server-side Article row. */
export interface Article {
  id: number
  tenant_id: string
  author_id: string
  slug: string
  title: string
  body_md: string
  body_html: string
  hero_image: string
  status: string
  published_at: string
  scheduled_at: string
  created_at: string
  updated_at: string
}

async function getJson<T>(
  path: string,
): Promise<T | null> {
  try {
    const r = await fetch(`${API}${path}`)
    if (!r.ok) return null
    return (await r.json()) as T
  } catch {
    return null
  }
}

export function useArticles() {
  const [items, setItems] = useState<Article[]>([])

  const refresh = useCallback(async () => {
    const d = await getJson<{ items: Article[] }>(
      '/articles',
    )
    if (d) setItems(d.items)
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { items, refresh }
}
