'use client'

/**
 * Album detail view — shows items in a grid, supports
 * bulk upload via UploadDrop and click-to-open Lightbox.
 */

import { useState } from 'react'
import {
  Alert, Box, Button, Typography,
} from '@shared/m3'
import { useAlbum } from '@/hooks/useAlbum'
import { UploadDrop } from './UploadDrop'
import { Lightbox } from './Lightbox'

/** Props for AlbumDetail. */
export interface AlbumDetailProps {
  galleryId: number
  onBack: () => void
}

export function AlbumDetail(
  { galleryId, onBack }: AlbumDetailProps,
) {
  const { items, loading, error, refresh } =
    useAlbum(galleryId)
  const [lightboxIdx, setLightboxIdx] =
    useState<number | null>(null)

  return (
    <Box className="gallery-shell">
      <Box className="gallery-header">
        <Button
          variant="text"
          onClick={onBack}
          data-testid="album-back"
          aria-label="Back to gallery list"
        >
          ← Back
        </Button>
        <Typography variant="h5">
          Album #{galleryId}
        </Typography>
      </Box>
      <UploadDrop
        galleryId={galleryId}
        onUploaded={refresh}
      />
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      {loading ? (
        <Typography>Loading…</Typography>
      ) : (
        <Box
          className="gallery-grid"
          data-testid="album-items"
        >
          {items.map((it, i) => (
            <Box
              key={it.asset_id}
              className="gallery-card"
              role="button"
              tabIndex={0}
              data-testid={`item-${it.asset_id}`}
              aria-label={`Open photo ${it.asset_id}`}
              onClick={() => setLightboxIdx(i)}
              onKeyDown={e => {
                if (e.key === 'Enter')
                  setLightboxIdx(i)
              }}
            >
              <Box
                className="gallery-card__cover"
                style={{
                  backgroundImage:
                    `url(/api/images/${it.asset_id}` +
                    `/variants/thumb)`,
                }}
              />
            </Box>
          ))}
        </Box>
      )}
      <Lightbox
        items={items}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
      />
    </Box>
  )
}
