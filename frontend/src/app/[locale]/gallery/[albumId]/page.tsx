'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box, Typography, CircularProgress,
} from '@shared/m3';
import { useAlbum } from '@/hooks/useAlbum';
import { AlbumHero } from '@/components/molecules/AlbumHero';
import { PhotoGrid } from '@/components/molecules/PhotoGrid';
import {
  PhotoLightbox,
} from '@/components/molecules/PhotoLightbox';

/**
 * Gallery album detail with cover header + masonry grid.
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
      <Box sx={{ p: 4, display: 'flex',
        justifyContent: 'center' }}
        data-testid="album-loading">
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
    <Box component="main" aria-label={album.title}
      data-testid="gallery-album-page">
      <AlbumHero album={album}
        backLabel={t('backToGallery')}
        photosLabel={t('photos')}
      />
      <Box sx={{ pt: 3, pb: 5, maxWidth: 1100, mx: 'auto' }}>
        {photos.length === 0
          ? (
            <Typography color="text.secondary">
              {t('empty')}
            </Typography>
          )
          : (
            <PhotoGrid photos={photos}
              onSelect={setLightboxIdx} />
          )}
      </Box>
      <PhotoLightbox photos={photos} index={lightboxIdx}
        onChangeIndex={setLightboxIdx}
        onClose={() => setLightboxIdx(-1)}
      />
    </Box>
  );
}
