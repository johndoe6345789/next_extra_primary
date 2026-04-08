/**
 * Table sort logic
 */

import type { SortConfig } from './tableTypes';

/** Sort items by configuration */
export function applySorting<
  T extends Record<string, unknown>
>(
  items: T[],
  sortConfig: SortConfig<T> | null
): T[] {
  if (!sortConfig) return items;
  const sorted = [...items];
  sorted.sort((a, b) => {
    const av = a[sortConfig.field];
    const bv = b[sortConfig.field];
    if (av === bv) return 0;
    const asc = sortConfig.direction === 'asc';
    if (asc) return av < bv ? -1 : 1;
    return av > bv ? -1 : 1;
  });
  return sorted;
}
