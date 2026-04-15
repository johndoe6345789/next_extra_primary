'use client'

/**
 * Full-screen image lightbox for an album.
 * Keyboard: ArrowLeft / ArrowRight / Escape.
 */

import { useEffect } from 'react'
import { Box } from '@shared/m3'
import type { AlbumItem } from '@/hooks/useAlbum'

/** Props for Lightbox. */
export interface LightboxProps {
  items: AlbumItem[]
  index: number | null
  onClose: () => void
}

export function Lightbox(
  { items, index, onClose }: LightboxProps,
) {
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () =>
      window.removeEventListener('keydown', onKey)
  }, [index, onClose])

  if (index === null || !items[index]) return null
  const current = items[index]
  const src =
    `/api/images/${current.asset_id}` +
    `/variants/large`

  return (
    <Box
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo preview"
      data-testid="lightbox"
      onClick={onClose}
    >
      <img
        className="lightbox__img"
        src={src}
        alt={current.caption || 'photo'}
      />
    </Box>
  )
}
