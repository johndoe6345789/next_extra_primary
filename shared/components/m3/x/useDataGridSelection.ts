'use client';

import { useCallback } from 'react';
import { GridRowParams } from './dataGridTypes';

/**
 * Hook handling row click selection and
 * select-all toggling for the DataGrid.
 */
export function useDataGridSelection(
  rows: Record<string, unknown>[],
  selectedIds: Set<string | number>,
  setSelectedIds: (
    ids: Set<string | number>
  ) => void,
  getRowId: (
    row: Record<string, unknown>
  ) => string | number,
  checkboxSelection: boolean,
  disableSelectionOnClick: boolean,
  onRowClick?: (p: GridRowParams) => void,
  onSelectionModelChange?: (
    ids: (string | number)[]
  ) => void
) {
  const handleRowClick = useCallback(
    (row: Record<string, unknown>) => {
      const id = getRowId(row);
      if (
        checkboxSelection &&
        !disableSelectionOnClick
      ) {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
        onSelectionModelChange?.(
          Array.from(next)
        );
      }
      onRowClick?.({ row, id });
    },
    [
      getRowId,
      checkboxSelection,
      disableSelectionOnClick,
      selectedIds,
      setSelectedIds,
      onSelectionModelChange,
      onRowClick,
    ]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
      onSelectionModelChange?.([]);
    } else {
      const all = new Set(rows.map(getRowId));
      setSelectedIds(all);
      onSelectionModelChange?.(
        Array.from(all)
      );
    }
  }, [
    rows,
    selectedIds,
    setSelectedIds,
    getRowId,
    onSelectionModelChange,
  ]);

  return { handleRowClick, handleSelectAll };
}
