'use client'

/**
 * Gallery operator — root page.
 * Switches between album grid and album detail view.
 */

import { useState } from 'react'
import {
  Typography, Alert, Box,
} from '@shared/m3'
import { useGalleries } from '@/hooks/useGalleries'
import { AlbumGrid } from './AlbumGrid'
import { AlbumDetail } from './AlbumDetail'

export default function GalleryPage() {
  const { galleries, loading, error, refresh } =
    useGalleries()
  const [selected, setSelected] =
    useState<number | null>(null)

  if (selected !== null) {
    return (
      <AlbumDetail
        galleryId={selected}
        onBack={() => {
          setSelected(null)
          refresh()
        }}
      />
    )
  }

  return (
    <Box className="gallery-shell">
      <Box className="gallery-header">
        <Typography variant="h4">
          Photo galleries
        </Typography>
      </Box>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}
      {loading ? (
        <Typography>Loading…</Typography>
      ) : (
        <AlbumGrid
          galleries={galleries}
          onOpen={setSelected}
        />
      )}
    </Box>
  )
}
