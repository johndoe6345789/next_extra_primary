'use client';

/**
 * @file useFlagged.ts
 * @brief Fetches flagged comments from the
 *        backend moderation API.
 */

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

/** @brief Shape of a flagged comment row. */
export interface FlaggedComment {
  id: number;
  target_type: string;
  target_id: string;
  author_id: string;
  body: string;
  flag_count: number;
  created_at: string;
}

const ENDPOINT =
  '/api/comments/v2/flagged?limit=100';

/**
 * @brief Hook returning flagged comments +
 *        a refetch function.
 */
export function useFlagged() {
  const [flagged, setFlagged] =
    useState<FlaggedComment[]>([]);
  const [loading, setLoading] =
    useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(ENDPOINT, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status}`,
        );
      }
      const data = await res.json();
      setFlagged(
        (data.data ??
          data) as FlaggedComment[],
      );
    } catch (err) {
      console.error('useFlagged', err);
      setFlagged([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { flagged, loading, refetch };
}
