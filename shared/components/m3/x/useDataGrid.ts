'use client';

import {
  useState, useMemo, useCallback,
} from 'react';
import { GridSortModel } from './dataGridTypes';
import {
  computeNextSort, sortRows,
} from './dataGridSort';

/**
 * Hook for DataGrid sort, pagination,
 * and selection state.
 */
export function useDataGrid(
  rows: Record<string, unknown>[],
  pageSize: number,
  sortModel: GridSortModel[] | undefined,
  onSortModelChange?: (
    model: GridSortModel[]
  ) => void,
  getRowId: (
    row: Record<string, unknown>
  ) => string | number = (r) =>
    r.id as string | number
) {
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] =
    useState<Set<string | number>>(new Set());
  const [internalSort, setInternalSort] =
    useState<GridSortModel[]>(
      sortModel || []);
  const currentSort =
    sortModel || internalSort;
  const handleSort = useCallback(
    (field: string) => {
      const model =
        computeNextSort(currentSort, field)
      if (onSortModelChange) {
        onSortModelChange(model)
      } else {
        setInternalSort(model)
      }
    },
    [currentSort, onSortModelChange]
  );
  const sortedRows = useMemo(
    () => sortRows(rows, currentSort),
    [rows, currentSort]);
  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return sortedRows.slice(
      start, start + pageSize);
  }, [sortedRows, page, pageSize]);
  const totalPages = Math.ceil(
    rows.length / pageSize);
  return {
    page, setPage,
    selectedIds, setSelectedIds,
    currentSort, handleSort,
    sortedRows, paginatedRows,
    totalPages, getRowId,
  };
}
