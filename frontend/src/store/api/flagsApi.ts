/**
 * Feature-flags evaluation API.
 * Calls GET /api/flags/evaluate?names=...
 * @module store/api/flagsApi
 */
import { baseApi } from './baseApi';

/** Map of flag name → enabled. */
export type FlagMap = Record<string, boolean>;

/** Flags API endpoints. */
export const flagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Evaluate a list of named feature flags.
     * @param names - Comma-separated flag names.
     */
    evaluateFlags: build.query<
      FlagMap,
      string[]
    >({
      query: (names) =>
        `/flags/evaluate?names=${names.join(',')}`,
      providesTags: ['Features'],
    }),
  }),
});

export const { useEvaluateFlagsQuery } = flagsApi;
