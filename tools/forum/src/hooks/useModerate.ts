'use client';

/**
 * @file useModerate.ts
 * @brief Hook exposing moderator actions
 *        against the comments v2 API.
 */

import { useCallback, useState } from 'react';

const BASE = '/api/comments/v2';

/** @brief POST helper for moderator actions. */
async function post(url: string): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
}

/**
 * @brief Returns moderation action callbacks
 *        and a shared busy flag.
 */
export function useModerate() {
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (
      fn: () => Promise<void>,
    ): Promise<void> => {
      setBusy(true);
      try {
        await fn();
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const hide = useCallback(
    (id: number) =>
      run(() => post(`${BASE}/${id}/hide`)),
    [run],
  );
  const unhide = useCallback(
    (id: number) =>
      run(() =>
        post(`${BASE}/${id}/unhide`)),
    [run],
  );
  const clearFlags = useCallback(
    (id: number) =>
      run(() =>
        post(`${BASE}/${id}/clear-flags`)),
    [run],
  );

  return { busy, hide, unhide, clearFlags };
}
