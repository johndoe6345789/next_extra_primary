'use client'

/**
 * Grid of photo-album cards.  Each card shows the cover
 * thumbnail and opens the AlbumDetail on click.
 */

import { Box, Typography } from '@shared/m3'
import type { Gallery } from '@/hooks/useGalleries'

/** Props for AlbumGrid. */
export interface AlbumGridProps {
  galleries: Gallery[]
  onOpen: (id: number) => void
}

const variantUrl = (assetId: number | null) => {
  if (!assetId) return ''
  return (
    `/api/images/${assetId}/variants/thumb`
  )
}

export function AlbumGrid(
  { galleries, onOpen }: AlbumGridProps,
) {
  if (galleries.length === 0) {
    return (
      <Typography>
        No galleries yet. Create one to get started.
      </Typography>
    )
  }
  return (
    <Box
      className="gallery-grid"
      data-testid="gallery-grid"
      aria-label="Photo gallery list"
    >
      {galleries.map(g => (
        <Box
          key={g.id}
          className="gallery-card"
          role="button"
          tabIndex={0}
          data-testid={`gallery-card-${g.id}`}
          aria-label={`Open ${g.title}`}
          onClick={() => onOpen(g.id)}
          onKeyDown={e => {
            if (e.key === 'Enter') onOpen(g.id)
          }}
        >
          <Box
            className="gallery-card__cover"
            style={{
              backgroundImage:
                `url(${variantUrl(g.cover_asset_id)})`,
            }}
          />
          <Box className="gallery-card__body">
            <Typography variant="body1">
              {g.title}
            </Typography>
            <Typography variant="caption">
              {g.item_count} items
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
