'use client';

import React, { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
} from '@shared/m3';
import type { Photo } from '@/types/content';
import content from '@/constants/content.json';

/** Props for PhotoLightbox. */
export interface PhotoLightboxProps {
  /** Photos array. */
  photos: Photo[];
  /** Currently selected index, or -1 when closed. */
  index: number;
  /** Called to change the active index. */
  onChangeIndex: (i: number) => void;
  /** Called to close the lightbox. */
  onClose: () => void;
}

/**
 * Full-screen photo lightbox with keyboard prev/next nav.
 *
 * @param props - PhotoLightbox props.
 * @returns Lightbox dialog UI.
 */
export function PhotoLightbox({
  photos,
  index,
  onChangeIndex,
  onClose,
}: PhotoLightboxProps): React.ReactElement {
  const t = useTranslations('gallery');
  const open = index >= 0;
  const photo = open ? photos[index] : null;

  const prev = useCallback(() => {
    if (index > 0) onChangeIndex(index - 1);
  }, [index, onChangeIndex]);

  const next = useCallback(() => {
    if (index < photos.length - 1) onChangeIndex(index + 1);
  }, [index, photos.length, onChangeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  const src = photo
    ? (photo.variants[content.gallery.variantLightbox]
        ?? Object.values(photo.variants)[0]
        ?? '')
    : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      testId="photo-lightbox"
      aria-labelledby="lightbox-caption"
    >
      <DialogContent
        style={{ overscrollBehavior: 'contain', padding: 0 }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#000',
            minHeight: '60dvh',
          }}
        >
          <IconButton
            aria-label={t('prev')}
            onClick={prev}
            disabled={index <= 0}
            data-testid="lightbox-prev"
            style={{ position: 'absolute', left: 8 }}
          >
            ‹
          </IconButton>
          {photo && (
            <img
              src={src}
              alt={photo.caption ?? photo.title ?? t('photo')}
              style={{ maxHeight: '80dvh', maxWidth: '100%' }}
              data-testid="lightbox-image"
            />
          )}
          <IconButton
            aria-label={t('next')}
            onClick={next}
            disabled={index >= photos.length - 1}
            data-testid="lightbox-next"
            style={{ position: 'absolute', right: 8 }}
          >
            ›
          </IconButton>
        </Box>
        {photo?.caption && (
          <Typography
            id="lightbox-caption"
            variant="body2"
            sx={{ p: 1, textAlign: 'center' }}
          >
            {photo.caption}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoLightbox;
