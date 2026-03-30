'use client';

import React from 'react';
import MuiAvatar from '@metabuilder/m3/Avatar';

/** Predefined avatar size presets in pixels. */
const SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
} as const;

/**
 * Props for the Avatar component.
 */
export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Required alt text for accessibility */
  alt: string;
  /** Predefined size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Text shown when no image is available */
  fallbackText?: string;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * An avatar component wrapping MUI Avatar.
 * Supports three size presets and a text fallback
 * when no image source is provided.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallbackText,
  onClick,
  testId = 'avatar',
}) => {
  const px = SIZES[size];

  return (
    <MuiAvatar
      src={src}
      alt={alt}
      aria-label={alt}
      sx={{
        width: px, height: px,
        ...(onClick && { cursor: 'pointer' }),
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-testid={testId}
    >
      {!src && fallbackText ? fallbackText.charAt(0).toUpperCase() : undefined}
    </MuiAvatar>
  );
};

export default Avatar;
