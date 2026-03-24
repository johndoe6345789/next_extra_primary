/**
 * Lightweight fetch wrapper with typed responses
 * and URL builder utility.
 * @module lib/api
 */
import type { ApiError, ApiResponse } from '../types/api';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '/api';

/**
 * Build a full API URL with optional query params.
 * @param path  - API path (e.g. "/users")
 * @param params - key-value query parameters
 */
export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  const url = new URL(path, BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

/**
 * Type-safe fetch wrapper.
 * Throws an {@link ApiError} on non-2xx responses.
 * @param path  - API path
 * @param init  - standard RequestInit overrides
 * @returns Parsed JSON body typed as T
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const url = buildUrl(path);

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error: ApiError = {
      status: res.status,
      message: body.message ?? res.statusText,
      code: body.code,
      details: body.details,
    };
    throw error;
  }

  return res.json() as Promise<ApiResponse<T>>;
}
