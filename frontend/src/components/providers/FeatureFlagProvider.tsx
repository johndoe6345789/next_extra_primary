'use client';

/**
 * Fetches /api/flags/evaluate on mount and stores
 * results in FeatureFlagContext.
 * @module components/providers/FeatureFlagProvider
 */
import React, {
  type ReactNode,
  type ReactElement,
} from 'react';
import {
  FeatureFlagContext,
  type FlagMap,
} from '@/contexts/FeatureFlagContext';
import { useEvaluateFlagsQuery }
  from '@/store/api/flagsApi';
import flagNames
  from '@/constants/feature-flags.json';

/** Props for FeatureFlagProvider. */
interface FeatureFlagProviderProps {
  /**
   * Optional pre-fetched flags from a Server
   * Component for SSR-compatible hydration.
   */
  initialFlags?: FlagMap;
  /** Children to wrap. */
  children: ReactNode;
}

/**
 * Evaluates all known feature flags on mount and
 * exposes them via FeatureFlagContext.
 * Accepts optional `initialFlags` prop for SSR.
 *
 * @param props - Provider props.
 * @returns Context-wrapped component tree.
 */
export function FeatureFlagProvider({
  initialFlags = {},
  children,
}: FeatureFlagProviderProps): ReactElement {
  const { data } = useEvaluateFlagsQuery(
    flagNames.flags,
  );

  const flags: FlagMap = data ?? initialFlags;

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export default FeatureFlagProvider;
