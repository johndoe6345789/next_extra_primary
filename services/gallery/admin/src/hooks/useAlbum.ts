'use client'

/**
 * Fetches the items of a single gallery.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

/** One item in an album. */
export interface AlbumItem {
  gallery_id: number
  asset_id: number
  position: number
  caption: string
}

/** Hook returning the items for a gallery. */
export function useAlbum(galleryId: number) {
  const [items, setItems] =
    useState<AlbumItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(
        `/gallery/api/gallery/${galleryId}/items`,
        { credentials: 'include' },
      )
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`)
      }
      const data = await r.json()
      setItems(data.items ?? [])
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    } finally {
      setLoading(false)
    }
  }, [galleryId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, loading, error, refresh }
}
