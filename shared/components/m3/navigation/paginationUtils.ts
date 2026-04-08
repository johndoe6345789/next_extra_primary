/**
 * Utility function for building pagination items.
 */

import type { PaginationRenderItemParams } from './PaginationTypes'

/** Build the ordered list of page items */
export function generateItems(
  page: number,
  count: number,
  boundaryCount: number,
  siblingCount: number,
  showFirst: boolean,
  showLast: boolean,
  hidePrev: boolean,
  hideNext: boolean,
  disabled: boolean,
): PaginationRenderItemParams[] {
  const items: PaginationRenderItemParams[] = []
  const range = (a: number, b: number) =>
    Array.from({ length: b - a + 1 }, (_, i) => a + i)

  if (showFirst)
    items.push({ type: 'first', page: 1, disabled: page === 1 || disabled })
  if (!hidePrev)
    items.push({ type: 'previous', page: page - 1, disabled: page === 1 || disabled })

  const start = range(1, Math.min(boundaryCount, count))
  const end = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  )
  const sStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )
  const sEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    end.length > 0 && end[0] !== undefined ? end[0] - 2 : count - 1,
  )

  const list = [
    ...start,
    ...(sStart > boundaryCount + 2
      ? ['ellipsis']
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1] : []),
    ...range(sStart, sEnd),
    ...(sEnd < count - boundaryCount - 1
      ? ['ellipsis']
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount] : []),
    ...end,
  ]

  list.forEach((item) => {
    if (item === 'ellipsis') {
      items.push({ type: 'ellipsis', page: null, disabled: true })
    } else {
      items.push({
        type: 'page',
        page: item as number,
        selected: item === page,
        disabled,
      })
    }
  })

  if (!hideNext)
    items.push({ type: 'next', page: page + 1, disabled: page === count || disabled })
  if (showLast)
    items.push({ type: 'last', page: count, disabled: page === count || disabled })

  return items
}
