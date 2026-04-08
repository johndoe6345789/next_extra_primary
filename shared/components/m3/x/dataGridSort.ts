import type { GridSortModel }
  from './dataGridTypes'

/**
 * Compute the next sort model for a field.
 * @param currentSort - Current sort models.
 * @param field - Field to toggle sort on.
 * @returns New sort model array.
 */
export function computeNextSort(
  currentSort: GridSortModel[],
  field: string,
): GridSortModel[] {
  const existing = currentSort.find(
    (s) => s.field === field)
  let next: 'asc' | 'desc' | null = 'asc'
  if (existing) {
    next = existing.sort === 'asc'
      ? 'desc' : null
  }
  return next ? [{ field, sort: next }] : []
}

/**
 * Sort rows by the first sort model entry.
 * @param rows - Data rows.
 * @param sort - Sort model array.
 * @returns Sorted rows copy.
 */
export function sortRows(
  rows: Record<string, unknown>[],
  sort: GridSortModel[],
): Record<string, unknown>[] {
  if (sort.length === 0) return rows
  const s = sort[0]
  if (!s) return rows
  return [...rows].sort((a, b) => {
    const aV = a[s.field] as string | number
    const bV = b[s.field] as string | number
    if (aV < bV)
      return s.sort === 'asc' ? -1 : 1
    if (aV > bV)
      return s.sort === 'asc' ? 1 : -1
    return 0
  })
}
