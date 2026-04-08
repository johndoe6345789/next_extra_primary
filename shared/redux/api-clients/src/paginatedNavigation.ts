/**
 * Paginated navigation callback builders.
 *
 * Builds page navigation functions from
 * Redux paginated result.
 */

/** @brief Redux paginated result shape */
interface ReduxPagResult {
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
}

/**
 * Build goToPage callback.
 * @param setPage - State setter
 * @param result - Redux paginated result
 * @param pageCount - Total pages
 */
export function buildGoToPage(
  setPage: (p: number) => void,
  result: ReduxPagResult,
  pageCount: number
) {
  return (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPage(newPage)
      result.goToPage(newPage + 1)
    }
  }
}

/**
 * Build nextPage callback.
 * @param page - Current page
 * @param setPage - State setter
 * @param result - Redux paginated result
 * @param pageCount - Total pages
 */
export function buildNextPage(
  page: number,
  setPage: (p: number) => void,
  result: ReduxPagResult,
  pageCount: number
) {
  return () => {
    if (page < pageCount - 1) {
      setPage(page + 1)
      result.nextPage()
    }
  }
}

/**
 * Build previousPage callback.
 * @param page - Current page
 * @param setPage - State setter
 * @param result - Redux paginated result
 */
export function buildPreviousPage(
  page: number,
  setPage: (p: number) => void,
  result: ReduxPagResult
) {
  return () => {
    if (page > 0) {
      setPage(page - 1)
      result.prevPage()
    }
  }
}
