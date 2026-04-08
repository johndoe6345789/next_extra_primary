/**
 * Style constants for the ProfileHeader
 * organism.
 * @module components/organisms/profileHeaderStyles
 */
import type { CSSProperties } from 'react';

/** Wrapper flex container. */
export const wrapStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  flexWrap: 'wrap',
};

/** Circular avatar initial styling. */
export const avatarStyle: CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: 'var(--mat-sys-primary)',
  color: 'var(--mat-sys-on-primary, #fff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  fontWeight: 700,
};

/** Row wrapping the stat pills. */
export const statsRow: CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
};
