'use client';

/**
 * Renders children only when a feature flag is
 * enabled; otherwise renders the fallback.
 * @module components/atoms/FeatureFlagGate
 */
import React, { type ReactNode } from 'react';
import { useFeatureFlag }
  from '@/hooks/useFeatureFlag';

/** Props for the FeatureFlagGate atom. */
export interface FeatureFlagGateProps {
  /**
   * Name of the feature flag to evaluate.
   */
  flag: string;
  /**
   * Content to render when flag is enabled.
   */
  children: ReactNode;
  /**
   * Fallback when flag is disabled/unknown.
   * @default null
   */
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on a
 * feature-flag value from FeatureFlagContext.
 *
 * @param props - Gate props.
 */
export function FeatureFlagGate({
  flag,
  children,
  fallback = null,
}: FeatureFlagGateProps): React.ReactElement {
  const enabled = useFeatureFlag(flag);
  return (
    <>{enabled ? children : fallback}</>
  );
}

export default FeatureFlagGate;
