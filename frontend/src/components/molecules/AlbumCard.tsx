'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import type { Album } from '@/types/content';

/** Props for AlbumCard. */
export interface AlbumCardProps {
  /** Album to display. */
  album: Album;
  /** Localised photos label. */
  photosLabel: string;
  /**
   * Featured mode — cinematic 21:9 ratio, larger type.
   * Parent should apply `gridColumn: '1 / -1'`.
   */
  featured?: boolean;
  /** Stagger delay index for entrance animation. */
  animDelay?: number;
}

/**
 * Album card with cover photo and gradient overlay.
 *
 * @param props - AlbumCard props.
 * @returns Linked card with hover scale animation.
 */
export function AlbumCard({
  album, photosLabel, featured = false, animDelay = 0,
}: AlbumCardProps): React.ReactElement {
  return (
    <Box
      component={Link}
      href={`/gallery/${album.id}`}
      aria-label={album.title}
      data-testid={`album-card-${album.id}`}
      sx={{
        display: 'block', textDecoration: 'none',
        borderRadius: 3, overflow: 'hidden',
        position: 'relative',
        aspectRatio: featured ? '21/9' : '16/10',
        bgcolor: 'grey.900',
        animation: 'gallery-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both',
        animationDelay: `${animDelay}s`,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        },
        '&:hover .card-overlay': { opacity: 0.62 },
        '&:hover img': { transform: 'scale(1.05)' },
      }}
    >
      <Box
        component="img"
        src={album.coverUrl}
        alt={album.title}
        sx={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
      <Box
        className="card-overlay"
        sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(' +
            'to top, rgba(0,0,0,0.88) 0%,' +
            ' rgba(0,0,0,0.22) 55%, transparent 100%)',
          opacity: 0.85,
          transition: 'opacity 0.35s ease',
          p: featured ? 3.5 : 2.5,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Typography
          variant={featured ? 'h5' : 'h6'}
          fontWeight={700} color="#fff"
          sx={{
            lineHeight: 1.2, mb: 0.5,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {album.title}
        </Typography>
        {album.description && (
          <Typography variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.82)',
              mb: 1, display: 'block',
              fontSize: featured ? '0.82rem' : undefined,
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            }}>
            {album.description}
          </Typography>
        )}
        <Typography variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.68rem',
          }}>
          {album.photoCount} {photosLabel}
        </Typography>
      </Box>
    </Box>
  );
}

export default AlbumCard;
