'use client';

import React, { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog, DialogContent, Box, Typography,
} from '@shared/m3';
import type { Photo } from '@/types/content';
import content from '@/constants/content.json';
import {
  LIGHTBOX_BOX, LIGHTBOX_IMG, DIALOG_CONTENT,
} from './photoLightboxStyles';
import { LightboxNav } from './LightboxNav';
import { LightboxHeader } from './LightboxHeader';

/** Props for PhotoLightbox. */
export interface PhotoLightboxProps {
  photos: Photo[];
  /** -1 when closed. */
  index: number;
  onChangeIndex: (i: number) => void;
  onClose: () => void;
}

/** Photo lightbox with keyboard nav and counter. */
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
    const h = (e: KeyboardEvent) =>
      ({ ArrowLeft: prev, ArrowRight: next,
        Escape: onClose })[e.key]?.();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, prev, next, onClose]);

  const src = photo
    ? (photo.variants[content.gallery.variantLightbox]
        ?? Object.values(photo.variants)[0] ?? '')
    : '';

  return (
    <Dialog open={open} onClose={onClose}
      maxWidth="xl" fullWidth
      testId="photo-lightbox"
      aria-labelledby="lightbox-caption">
      <DialogContent style={DIALOG_CONTENT}>
        {open && (
          <LightboxHeader
            current={index + 1} total={photos.length}
            ofLabel={t('of')} closeLabel={t('close')}
            onClose={onClose}
          />
        )}
        <Box style={LIGHTBOX_BOX}>
          <LightboxNav
            prevLabel={t('prev')} nextLabel={t('next')}
            disablePrev={index <= 0}
            disableNext={index >= photos.length - 1}
            onPrev={prev} onNext={next}
          />
          {photo && (
            <img src={src}
              alt={photo.caption ?? photo.title ?? t('photo')}
              style={LIGHTBOX_IMG}
              data-testid="lightbox-image"
            />
          )}
        </Box>
        {photo?.caption && (
          <Typography id="lightbox-caption" variant="body2"
            sx={{ p: 1.5, textAlign: 'center',
              bgcolor: 'rgba(0,0,0,0.85)',
              color: 'rgba(255,255,255,0.85)' }}>
            {photo.caption}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PhotoLightbox;
