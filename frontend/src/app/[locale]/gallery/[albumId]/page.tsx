'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
} from '@shared/m3';
import { useAlbum } from '@/hooks/useAlbum';
import { PhotoGrid } from '@/components/molecules/PhotoGrid';
import { PhotoLightbox } from '@/components/molecules/PhotoLightbox';

/**
 * Gallery album detail page.
 *
 * Shows a photo grid with a lightbox on selection.
 *
 * @returns Album detail page UI.
 */
export default function GalleryAlbumPage(): React.ReactElement {
  const t = useTranslations('gallery');
  const { albumId } = useParams<{ albumId: string }>();
  const { album, photos, isLoading, error } =
    useAlbum(albumId ?? '');
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  if (isLoading) {
    return (
      <Box
        sx={{ p: 4, display: 'flex', justifyContent: 'center' }}
        data-testid="album-loading"
      >
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (error || !album) {
    return (
      <Box sx={{ p: 3 }} data-testid="album-error">
        <Typography color="error">
          {error ?? t('notFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      aria-label={album.title}
      data-testid="gallery-album-page"
      sx={{ p: 3, maxWidth: 960, mx: 'auto' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {album.title}
      </Typography>
      {album.description && (
        <Typography
          color="textSecondary"
          sx={{ mb: 2 }}
        >
          {album.description}
        </Typography>
      )}
      <PhotoGrid
        photos={photos}
        onSelect={setLightboxIdx}
      />
      <PhotoLightbox
        photos={photos}
        index={lightboxIdx}
        onChangeIndex={setLightboxIdx}
        onClose={() => setLightboxIdx(-1)}
      />
    </Box>
  );
}
