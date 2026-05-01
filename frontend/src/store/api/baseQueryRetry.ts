/**
 * Exponential-backoff retry wrapper around the
 * auth-aware base query.
 *
 * Why this exists: in the dev / template setup the
 * backend is rebuilt frequently, which causes a brief
 * window where nginx still routes to a dead upstream
 * (502) or the new container is still booting (503 /
 * connection refused). Without retry, every page in
 * the app silently shows an empty state during that
 * window and the user has to hard-reload. With retry,
 * the first request fails, waits, and succeeds on its
 * own — no human in the loop.
 *
 * Strategy:
 *   - Retry only on network errors and 5xx responses.
 *     4xx is deterministic — retrying won't help.
 *   - Skip retry on 401 (reauth wrapper handles it).
 *   - Up to RETRY_MAX attempts including the first.
 *   - Backoff doubles each time with a small jitter so
 *     concurrent queries don't stampede the upstream.
 *
 * @module store/api/baseQueryRetry
 */
import type {
  BaseQueryFn, FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import {
  baseQueryWithReauth,
} from './baseQueryReauth';

/** Max attempts including the first. */
const RETRY_MAX = 5;
/** Base delay in ms before the second attempt. */
const RETRY_BASE_MS = 200;
/** Cap so we never wait longer than this between tries. */
const RETRY_CAP_MS = 3000;

/**
 * Decide whether a failed result is worth retrying.
 * Network errors (no status) and 5xx are transient;
 * everything else is deterministic.
 */
function shouldRetry(
  err: FetchBaseQueryError | undefined,
): boolean {
  if (!err) return false;
  // Network failure / fetch threw
  if (err.status === 'FETCH_ERROR') return true;
  if (err.status === 'TIMEOUT_ERROR') return true;
  // HTTP status numeric
  if (typeof err.status === 'number') {
    if (err.status === 401) return false;
    return err.status >= 500 && err.status < 600;
  }
  return false;
}

/** Exponential backoff with ±25% jitter, capped. */
function backoffMs(attempt: number): number {
  const base = Math.min(
    RETRY_CAP_MS,
    RETRY_BASE_MS * 2 ** (attempt - 1),
  );
  const jitter = base * 0.25 * (Math.random() * 2 - 1);
  return Math.max(0, Math.round(base + jitter));
}

const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs, unknown, FetchBaseQueryError
> = async (args, api, extra) => {
  let result = await baseQueryWithReauth(
    args, api, extra,
  );
  for (let attempt = 1; attempt < RETRY_MAX; attempt++) {
    if (!shouldRetry(result.error)) return result;
    await sleep(backoffMs(attempt));
    result = await baseQueryWithReauth(
      args, api, extra,
    );
  }
  return result;
};
