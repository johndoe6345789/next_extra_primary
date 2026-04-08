/**
 * REST API storage write operations
 */

import type { IndexedDBStorage } from
  './indexedDBStorage';
import { storageUrl, withFallback } from
  './restAPIStorageRead';

/** Set a value via REST API */
export async function restSet(
  baseURL: string,
  key: string,
  val: unknown,
  fallback: IndexedDBStorage | null
) {
  const op = async () => {
    const r = await fetch(
      storageUrl(baseURL, key), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: val }),
      });
    if (!r.ok) throw new Error(`${r.status}`);
  };
  if (fallback) {
    return withFallback(
      op, () => fallback.set(key, val)
    );
  }
  return op();
}

/** Delete a value via REST API */
export async function restDelete(
  baseURL: string,
  key: string,
  fallback: IndexedDBStorage | null
) {
  const op = async () => {
    const r = await fetch(
      storageUrl(baseURL, key),
      { method: 'DELETE' });
    if (!r.ok) throw new Error(`${r.status}`);
  };
  if (fallback) {
    return withFallback(
      op, () => fallback.delete(key)
    );
  }
  return op();
}

/** Clear all values via REST API */
export async function restClear(
  baseURL: string,
  fallback: IndexedDBStorage | null
) {
  const op = async () => {
    const r = await fetch(
      `${baseURL}/api/storage`,
      { method: 'DELETE' });
    if (!r.ok) throw new Error(`${r.status}`);
  };
  if (fallback) {
    return withFallback(
      op, () => fallback.clear()
    );
  }
  return op();
}
