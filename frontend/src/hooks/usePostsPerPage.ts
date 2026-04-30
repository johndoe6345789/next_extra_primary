'use client';

import { useState, useEffect, useCallback } from 'react';

/** Pixels consumed by navbar, breadcrumb, thread title,
 *  pagination bar, reply composer, and page padding. */
const UI_OVERHEAD_PX = 340;

/** Typical height of one forum post card (px). */
const POST_HEIGHT_PX = 160;

/** Minimum posts to show (avoids degenerate pages). */
const MIN_POSTS = 3;

/** Maximum posts to show (avoids excessive DOM size). */
const MAX_POSTS = 30;

/** Default when viewport is too small to derive a
 *  meaningful count (e.g. landscape phone). */
const FALLBACK_POSTS = 5;

/**
 * Derives the optimal posts-per-page count from the
 * current viewport height.
 *
 * Falls back to {@link FALLBACK_POSTS} on landscape
 * phones (width > height && width < 900 px) where the
 * available height is too small to be useful.
 *
 * Recalculates on window resize so the count stays
 * correct if the user rotates the device or resizes
 * the browser window.
 */
export function usePostsPerPage(): number {
  const calculate = useCallback((): number => {
    const { innerWidth, innerHeight } = window;
    const isLandscapePhone =
      innerWidth > innerHeight && innerWidth < 900;
    if (isLandscapePhone) return FALLBACK_POSTS;
    const derived = Math.floor(
      (innerHeight - UI_OVERHEAD_PX) / POST_HEIGHT_PX,
    );
    return Math.max(MIN_POSTS, Math.min(MAX_POSTS, derived));
  }, []);

  const [count, setCount] = useState<number>(FALLBACK_POSTS);

  useEffect(() => {
    setCount(calculate());
    const onResize = () => setCount(calculate());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [calculate]);

  return count;
}

export default usePostsPerPage;
