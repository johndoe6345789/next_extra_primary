'use client';

/**
 * Reads a single feature-flag value from context.
 * @module hooks/useFeatureFlag
 */
import { useContext } from 'react';
import {
  FeatureFlagContext,
} from '@/contexts/FeatureFlagContext';

/**
 * Returns the enabled state of a named feature flag.
 *
 * @param name - Flag name to look up.
 * @returns `true` / `false`, or `undefined` if not
 *          yet loaded.
 */
export function useFeatureFlag(
  name: string,
): boolean | undefined {
  const flags = useContext(FeatureFlagContext);
  return flags[name];
}

export default useFeatureFlag;
