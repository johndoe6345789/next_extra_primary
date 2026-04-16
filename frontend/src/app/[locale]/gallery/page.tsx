'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useAlbums } from '@/hooks/useAlbums';

/**
 * Gallery album grid page.
 *
 * @returns Gallery index page UI.
 */
export default function GalleryPage(): React.ReactElement {
  const t = useTranslations('gallery');
  const { albums, isLoading, error } = useAlbums();

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      data-testid="gallery-page"
      sx={{ p: 3, maxWidth: 960, mx: 'auto' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      {isLoading && (
        <Typography data-testid="gallery-loading">
          {t('loading')}
        </Typography>
      )}
      {error && (
        <Typography color="error" data-testid="gallery-error">
          {error}
        </Typography>
      )}
      <Grid container spacing={2}>
        {albums.map((album) => (
          <Grid key={album.id} item xs={12} sm={6} md={4}>
            <Card data-testid={`album-card-${album.id}`}>
              <CardActionArea
                component={Link}
                href={`/gallery/${album.id}`}
                aria-label={album.title}
              >
                <CardMedia
                  component="div"
                  sx={{ height: 160, bgcolor: 'grey.200' }}
                  title={album.title}
                />
                <CardContent>
                  <Typography variant="subtitle1">
                    {album.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                  >
                    {album.photoCount} {t('photos')}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
