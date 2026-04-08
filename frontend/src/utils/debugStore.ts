/**
 * In-memory debug telemetry store.
 * Keeps a circular buffer of recent API calls
 * without touching Redux.
 * @module utils/debugStore
 */

/** Single API call record. */
export interface DebugEntry {
  /** ISO timestamp. */
  timestamp: string;
  /** HTTP method. */
  method: string;
  /** Request URL or path. */
  url: string;
  /** HTTP status code. */
  status: number;
  /** Backend X-Request-Id header. */
  requestId: string;
  /** Response time in ms. */
  duration: number;
  /** Error code from response body. */
  errorCode?: string;
}

const MAX_ENTRIES = 50;
const entries: DebugEntry[] = [];
const listeners: Set<() => void> = new Set();

/** Add a debug entry to the buffer. */
export function addDebugEntry(
  entry: DebugEntry,
): void {
  entries.unshift(entry);
  if (entries.length > MAX_ENTRIES) {
    entries.pop();
  }
  listeners.forEach((fn) => fn());
}

/** Get all entries (newest first). */
export function getDebugEntries(): DebugEntry[] {
  return entries;
}

/** Clear all entries. */
export function clearDebugEntries(): void {
  entries.length = 0;
  listeners.forEach((fn) => fn());
}

/** Subscribe to entry changes. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
