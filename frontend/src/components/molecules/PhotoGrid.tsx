'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import type { Photo } from '@/types/content';
import content from '@/constants/content.json';

/** Props for PhotoGrid. */
export interface PhotoGridProps {
  /** Array of photos to display. */
  photos: Photo[];
  /** Called with the clicked photo index. */
  onSelect: (index: number) => void;
}

/**
 * CSS column-count masonry grid for album photos.
 * Uses native column-count instead of ImageList
 * since the M3 wrapper doesn't support the masonry
 * variant.
 *
 * @param props - PhotoGrid props.
 * @returns Masonry grid of album photos.
 */
export function PhotoGrid({
  photos,
  onSelect,
}: PhotoGridProps): React.ReactElement {
  const t = useTranslations('gallery');
  return (
    <Box
      data-testid="photo-grid"
      aria-label={t('photoGrid')}
      style={{ columnCount: 3, columnGap: '12px' }}
      sx={{
        animation:
          'gallery-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) 0.15s both',
      }}
    >
      {photos.map((photo, idx) => {
        const src =
          photo.variants[content.gallery.variantGrid]
          ?? Object.values(photo.variants)[0]
          ?? '';
        const delay = Math.min(idx * 0.05, 0.25);
        return (
          <Box
            key={photo.id}
            data-testid={`photo-item-${photo.id}`}
            onClick={() => onSelect(idx)}
            sx={{
              breakInside: 'avoid',
              mb: '12px',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'block',
              animation:
                'gallery-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
              animationDelay: `${0.2 + delay}s`,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
              },
              '&:hover img': {
                transform: 'scale(1.04)',
              },
            }}
          >
            <img
              src={src}
              alt={photo.caption ?? photo.title
                ?? t('photo')}
              loading="lazy"
              style={{
                width: '100%',
                display: 'block',
                transition:
                  'transform 0.45s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
            {photo.caption && (
              <Box sx={{
                px: 1.5, py: 0.75,
                bgcolor: 'rgba(0,0,0,0.68)',
              }}>
                <Typography variant="caption"
                  sx={{ color: 'rgba(255,255,255,0.92)' }}>
                  {photo.caption}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default PhotoGrid;
