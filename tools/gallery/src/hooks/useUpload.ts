'use client'

/**
 * Bulk upload hook — POSTs each dropped file to the image
 * daemon, then calls the gallery bulk-import endpoint with
 * the returned source keys so image.process jobs fire.
 */

import { useCallback, useState } from 'react'

interface ImageCreateResp {
  id: number
  source_key?: string
}

/** Hook returning an `upload` action + pending flag. */
export function useUpload(galleryId: number) {
  const [pending, setPending] = useState(false)
  const [error, setError] =
    useState<string | null>(null)

  const upload = useCallback(
    async (files: File[]) => {
      setPending(true)
      setError(null)
      try {
        const entries: Array<{
          source_key: string
          mime: string
          caption: string
        }> = []
        for (const f of files) {
          const r = await fetch('/api/images', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': f.type || 'image/jpeg',
            },
            body: f,
          })
          if (!r.ok) continue
          const j = (await r.json()) as ImageCreateResp
          entries.push({
            source_key: j.source_key
              ?? `sources/${j.id}.bin`,
            mime: f.type || 'image/jpeg',
            caption: f.name,
          })
        }
        await fetch(
          `/gallery/api/gallery/${galleryId}/bulk`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entries }),
          },
        )
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'error',
        )
      } finally {
        setPending(false)
      }
    },
    [galleryId],
  )

  return { upload, pending, error }
}
