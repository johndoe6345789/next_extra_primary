'use client';

import React from 'react';
import Box from '@shared/m3/Box';

/** Props for a single avatar option. */
export interface AvatarOptionProps {
  /** Unique key for this option. */
  id: string;
  /** Image source, or null for "remove". */
  src: string | null;
  /** Whether this option is active. */
  active: boolean;
  /** Size in pixels. */
  size: number;
  /** Pick handler. */
  onPick: () => void;
  /** Accessible label. */
  label: string;
}

/**
 * Single circular avatar thumbnail in the
 * picker grid. Shows an image or an × icon.
 */
export const AvatarOption: React.FC<
  AvatarOptionProps
> = ({ id, src, active, size, onPick, label }) => (
  <Box
    role="button"
    tabIndex={0}
    aria-label={label}
    aria-pressed={active}
    data-testid={`avatar-${id}`}
    onClick={onPick}
    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter') onPick();
    }}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      cursor: 'pointer',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: active
        ? '3px solid var(--mat-sys-primary)'
        : '2px solid transparent',
      outlineOffset: '2px',
      transition: 'outline 0.15s',
      background: src
        ? 'none'
        : 'var(--mat-sys-surface-variant)',
      color: 'var(--mat-sys-on-surface-variant)',
      fontSize: '20px',
    }}
  >
    {src ? (
      <img src={src} alt={id}
        width={size} height={size} />
    ) : '✕'}
  </Box>
);

export default AvatarOption;
