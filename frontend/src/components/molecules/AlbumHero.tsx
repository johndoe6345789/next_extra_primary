'use client';

import React from 'react';
import { Box, Typography, Button } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import type { Album } from '@/types/content';

/** Props for AlbumHero. */
export interface AlbumHeroProps {
  /** Album data to display. */
  album: Album;
  /** Localised back label. */
  backLabel: string;
  /** Localised photos count label. */
  photosLabel: string;
}

/**
 * Full-width cover hero for a gallery album detail page.
 *
 * @param props - AlbumHero props.
 * @returns Hero with cover image, back button and metadata.
 */
export function AlbumHero({
  album, backLabel, photosLabel,
}: AlbumHeroProps): React.ReactElement {
  return (
    <Box sx={{
      position: 'relative', width: '100%',
      // Static — m3 Box doesn't resolve responsive sx.
      height: 380,
      overflow: 'hidden', bgcolor: 'grey.900',
      borderRadius: 3,
      animation: 'gallery-fade-in 0.5s ease both',
    }}>
      {album.coverUrl && (
        <Box component="img" src={album.coverUrl}
          alt={album.title}
          sx={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            filter: 'brightness(0.55)',
            transition: 'transform 0.6s ease',
          }}
        />
      )}
      {/* Bottom gradient for title legibility */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(' +
          'to top, rgba(0,0,0,0.82) 0%,' +
          ' rgba(0,0,0,0.15) 55%, transparent 100%)',
      }} />
      {/* Overlay: back button top, title bottom */}
      <Box sx={{
        position: 'absolute', inset: 0, p: 3,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Box>
          <Button
            component={Link} href="/gallery"
            data-testid="back-to-gallery"
            aria-label={backLabel}
            variant="outlined" size="small"
            sx={{
              color: '#fff', fontSize: '0.75rem',
              borderColor: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(8px)',
              bgcolor: 'rgba(0,0,0,0.22)',
              borderRadius: 6,
              transition: 'all 0.25s ease',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.9)',
                bgcolor: 'rgba(0,0,0,0.4)',
              },
            }}
          >
            ← {backLabel}
          </Button>
        </Box>
        <Box>
          <Typography variant="h4" component="h1"
            fontWeight={700} color="#fff"
            sx={{
              lineHeight: 1.15, mb: 0.5,
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}>
            {album.title}
          </Typography>
          {album.description && (
            <Typography variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.82)',
                mt: 0.5, mb: 0.75,
                textShadow: '0 1px 6px rgba(0,0,0,0.5)',
              }}>
              {album.description}
            </Typography>
          )}
          <Typography variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: '0.68rem',
            }}>
            {album.photoCount} {photosLabel}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AlbumHero;
