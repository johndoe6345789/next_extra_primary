'use client';

/**
 * EditorialHeader — centered eyebrow + bold title +
 * 56-px primary accent rule. The signature header
 * pattern used by the polished UI surfaces.
 *
 * @module components/molecules/EditorialHeader
 */
import React from 'react';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';

/** Props for EditorialHeader. */
export interface EditorialHeaderProps {
  /** Small uppercase line above the title. */
  eyebrow?: string;
  /** Main headline. */
  title: string;
  /** Bottom margin around the whole header in px. */
  bottomGapPx?: number;
}

/**
 * Centered editorial header.
 *
 * @param props - Component props.
 */
export const EditorialHeader: React.FC<
  EditorialHeaderProps
> = ({ eyebrow, title, bottomGapPx = 32 }) => (
  <Box
    data-testid="editorial-header"
    sx={{
      marginBottom: `${bottomGapPx}px`,
      textAlign: 'center',
    }}
  >
    {eyebrow && (
      <Typography component="div" sx={{
        fontSize: '0.75rem', fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'primary.main', opacity: 0.85,
        marginBottom: '12px',
      }}>
        {eyebrow}
      </Typography>
    )}
    <Typography component="h1" fontWeight={700}
      sx={{
        fontSize: '2.4rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: 'text.primary',
      }}>
      {title}
    </Typography>
    <Box sx={{
      marginTop: '20px',
      marginLeft: 'auto', marginRight: 'auto',
      width: '56px', height: '3px',
      borderRadius: '2px',
      backgroundColor:
        'var(--mui-palette-primary-main)',
      opacity: 0.7,
    }} />
  </Box>
);

export default EditorialHeader;
