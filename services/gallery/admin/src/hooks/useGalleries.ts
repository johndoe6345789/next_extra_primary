'use client'

/**
 * Fetches the gallery list from the backend daemon.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

/** One gallery row. */
export interface Gallery {
  id: number
  slug: string
  title: string
  description: string
  cover_asset_id: number | null
  item_count: number
  created_at: string
  updated_at: string
}

const API = '/gallery/api/gallery'

/** Hook returning the gallery list + refresh fn. */
export function useGalleries() {
  const [galleries, setGalleries] =
    useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(API, {
        credentials: 'include',
      })
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`)
      }
      const data = await r.json()
      setGalleries(data.galleries ?? [])
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { galleries, loading, error, refresh }
}
