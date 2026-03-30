'use client';

import React from 'react';
import MuiSkeleton from '@metabuilder/m3/Skeleton';

/**
 * Props for the Skeleton component.
 */
export interface SkeletonProps {
  /** Shape variant of the skeleton */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Width in pixels or CSS string */
  width?: number | string;
  /** Height in pixels or CSS string */
  height?: number | string;
  /** Animation type or false to disable */
  animation?: 'pulse' | 'wave' | false;
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * A loading placeholder wrapping MUI Skeleton.
 * Used to indicate content is loading.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  testId = 'skeleton',
}) => {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      data-testid={testId}
      aria-label="Loading"
      role="progressbar"
    />
  );
};

export default Skeleton;
