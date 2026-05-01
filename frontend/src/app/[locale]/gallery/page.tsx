'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Typography, CircularProgress,
} from '@shared/m3';
import { useAlbums } from '@/hooks/useAlbums';
import {
  AlbumCard,
} from '@/components/molecules/AlbumCard';

/**
 * Gallery landing — featured hero album + grid.
 *
 * @returns Gallery index page with album cards.
 */
export default function GalleryPage() {
  const t = useTranslations('gallery');
  const { albums, isLoading, error } = useAlbums();

  return (
    <Box component="main" role="main"
      data-testid="gallery-page"
      aria-label={t('title')}
      sx={{ maxWidth: 1200, mx: 'auto' }}
    >
      <Box sx={{
        mb: 4,
        animation: 'gallery-fade-in 0.4s ease both',
      }}>
        <Typography variant="h3" component="h1"
          fontWeight={800}
          sx={{
            letterSpacing: '-0.02em', mb: 0.5,
            color: 'primary.main',
          }}>
          {t('title')}
        </Typography>
        {!isLoading && !error && albums.length > 0 && (
          <Typography variant="body2"
            sx={{ color: 'text.secondary' }}>
            {albums.length} {t('albums')}
          </Typography>
        )}
      </Box>

      {isLoading && (
        <Box sx={{
          display: 'flex', justifyContent: 'center',
          py: 8,
        }} data-testid="gallery-loading">
          <CircularProgress aria-label={t('loading')} />
        </Box>
      )}
      {error && (
        <Typography color="error"
          data-testid="gallery-error">{error}
        </Typography>
      )}
      {!isLoading && !error && albums.length === 0 && (
        <Typography color="text.secondary">
          {t('noAlbums')}
        </Typography>
      )}

      {/* Featured first album spans full width */}
      {albums.length > 0 && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
        }}>
          {albums.map((album, i) => (
            <Box key={album.id}
              sx={i === 0
                ? { gridColumn: '1 / -1' }
                : {}}>
              <AlbumCard
                album={album}
                photosLabel={t('photos')}
                featured={i === 0}
                animDelay={i * 0.08}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
