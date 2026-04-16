'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@shared/m3';
import type { Photo } from '@/types/content';
import content from '@/constants/content.json';

/** Props for PhotoGrid. */
export interface PhotoGridProps {
  /** Array of photos to display. */
  photos: Photo[];
  /** Called when a photo is clicked. */
  onSelect: (index: number) => void;
}

/**
 * Responsive photo grid for gallery album view.
 *
 * @param props - PhotoGrid props.
 * @returns Photo grid UI.
 */
export function PhotoGrid({
  photos,
  onSelect,
}: PhotoGridProps): React.ReactElement {
  const t = useTranslations('gallery');
  return (
    <ImageList
      cols={3}
      gap={8}
      data-testid="photo-grid"
      aria-label={t('photoGrid')}
    >
      {photos.map((photo, idx) => {
        const src =
          photo.variants[content.gallery.variantGrid]
          ?? Object.values(photo.variants)[0]
          ?? '';
        return (
          <ImageListItem
            key={photo.id}
            data-testid={`photo-item-${photo.id}`}
            onClick={() => onSelect(idx)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={src}
              alt={photo.caption ?? photo.title ?? t('photo')}
              loading="lazy"
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            {photo.caption && (
              <ImageListItemBar title={photo.caption} />
            )}
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}

export default PhotoGrid;
