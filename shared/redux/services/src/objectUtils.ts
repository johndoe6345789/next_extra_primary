/**
 * Object and data utility functions
 */

/**
 * Generate a unique ID (timestamp + random)
 */
export function generateId(): string {
  const rand = Math.random()
    .toString(36)
    .substring(2, 9);
  return `${Date.now()}-${rand}`;
}

/**
 * Deep clone an object via JSON serialization.
 * Does not support functions, symbols, or
 * circular references.
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is a plain object
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Safely parse JSON with a fallback value
 */
export function safeJsonParse<T>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
