'use client';

import React, { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, Box, Typography } from '@shared/m3';
import type { Photo } from '@/types/content';
import content from '@/constants/content.json';
import {
  LIGHTBOX_BOX, LIGHTBOX_IMG, DIALOG_CONTENT,
} from './photoLightboxStyles';
import { LightboxNav } from './LightboxNav';

/** Props for PhotoLightbox. */
export interface PhotoLightboxProps {
  /** Photos array. */
  photos: Photo[];
  /** Selected index, or -1 when closed. */
  index: number;
  /** Called to change the active index. */
  onChangeIndex: (i: number) => void;
  /** Called to close the lightbox. */
  onClose: () => void;
}

/**
 * Photo lightbox with keyboard prev/next nav.
 *
 * @param props - PhotoLightbox props.
 * @returns Lightbox dialog UI.
 */
export function PhotoLightbox({
  photos, index, onChangeIndex, onClose,
}: PhotoLightboxProps): React.ReactElement {
  const t = useTranslations('gallery');
  const open = index >= 0;
  const photo = open ? photos[index] : null;

  const prev = useCallback(
    () => { if (index > 0) onChangeIndex(index - 1); },
    [index, onChangeIndex],
  );
  const next = useCallback(
    () => {
      if (index < photos.length - 1) onChangeIndex(index + 1);
    },
    [index, photos.length, onChangeIndex],
  );

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, prev, next]);

  const variantKey = content.gallery.variantLightbox;
  const src = photo
    ? (photo.variants[variantKey]
        ?? Object.values(photo.variants)[0] ?? '')
    : '';

  return (
    <Dialog
      open={open} onClose={onClose} maxWidth="xl" fullWidth
      testId="photo-lightbox" aria-labelledby="lightbox-caption"
    >
      <DialogContent style={DIALOG_CONTENT}>
        <Box style={LIGHTBOX_BOX}>
          <LightboxNav
            prevLabel={t('prev')} nextLabel={t('next')}
            disablePrev={index <= 0}
            disableNext={index >= photos.length - 1}
            onPrev={prev} onNext={next}
          />
          {photo && (
            <img
              src={src}
              alt={photo.caption ?? photo.title ?? t('photo')}
              style={LIGHTBOX_IMG}
              data-testid="lightbox-image"
            />
          )}
        </Box>
        {photo?.caption && (
          <Typography
            id="lightbox-caption" variant="body2"
            sx={{ p: 1, textAlign: 'center' }}
          >{photo.caption}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoLightbox;
