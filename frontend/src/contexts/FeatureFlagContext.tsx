'use client';

/**
 * React context holding evaluated feature flags.
 * @module contexts/FeatureFlagContext
 */
import { createContext } from 'react';

/** Map of flag name → enabled boolean. */
export type FlagMap = Record<string, boolean>;

/**
 * Context value: flag map populated by
 * FeatureFlagProvider on mount.
 * Defaults to an empty map (all flags undefined).
 */
export const FeatureFlagContext =
  createContext<FlagMap>({});
