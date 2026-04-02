'use client';

import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the given value.
 * The returned value only updates after the
 * specified delay has elapsed without changes.
 *
 * @template T - Type of the value to debounce.
 * @param value - The raw value to debounce.
 * @param delay - Debounce delay in ms (default 300).
 * @returns The debounced value.
 */
export function useDebounce<T>(
  value: T,
  delay = 300,
): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebounced(value),
      delay,
    );
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
