/**
 * REST API storage - read operations
 */

import type { IndexedDBStorage } from
  './indexedDBStorage';

/** Make URL for storage key */
export function storageUrl(
  baseURL: string, key: string
) {
  return `${baseURL}/api/storage/` +
    `${encodeURIComponent(key)}`;
}

/** Execute with IndexedDB fallback */
export async function withFallback<T>(
  op: () => Promise<T>,
  fb: (() => Promise<T>) | null
): Promise<T> {
  try { return await op(); }
  catch (err) {
    if (fb) {
      console.warn(
        'REST failed, using IndexedDB:', err
      );
      return fb();
    }
    throw err;
  }
}

/** Get a value from REST storage */
export async function restGet<T>(
  baseURL: string,
  key: string,
  fallback: IndexedDBStorage | null
): Promise<T | undefined> {
  const op = async () => {
    const res = await fetch(
      storageUrl(baseURL, key)
    );
    if (!res.ok) {
      if (res.status === 404) return undefined;
      throw new Error(`HTTP ${res.status}`);
    }
    const d = await res.json();
    return d.value as T;
  };
  if (fallback) {
    return withFallback(
      op, () => fallback.get<T>(key)
    );
  }
  return op();
}

/** List all keys from REST storage */
export async function restKeys(
  baseURL: string,
  fallback: IndexedDBStorage | null
): Promise<string[]> {
  const op = async () => {
    const res = await fetch(
      `${baseURL}/api/storage/keys`
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const d = await res.json();
    return d.keys;
  };
  if (fallback) {
    return withFallback(
      op, () => fallback.keys()
    );
  }
  return op();
}
