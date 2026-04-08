'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCanvasItems,
  duplicateCanvasItems,
  selectCanvasItems,
} from '@shared/redux-slices/canvasItemsSlice';
import {
  selectSelectedItemIds,
  setSelection,
} from '@shared/redux-slices/canvasSlice';

/**
 * Hook providing canvas item action handlers
 * for select-all, delete, and duplicate.
 */
export function useCanvasActions() {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedItemIds = useSelector(
    (state: unknown) =>
      selectSelectedItemIds(state)
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasItems = useSelector(
    (state: unknown) => selectCanvasItems(state)
  );

  const handleSelectAll = useCallback(() => {
    const allIds = (
      canvasItems as Array<{ id: string }>
    ).map((item) => item.id);
    dispatch(setSelection(new Set(allIds)));
  }, [canvasItems, dispatch]);

  const handleDeleteSelected =
    useCallback(() => {
      if (
        (selectedItemIds as Set<string>).size > 0
      ) {
        dispatch(
          deleteCanvasItems(
            Array.from(
              selectedItemIds as Set<string>
            )
          )
        );
      }
    }, [selectedItemIds, dispatch]);

  const handleDuplicateSelected =
    useCallback(() => {
      if (
        (selectedItemIds as Set<string>).size > 0
      ) {
        dispatch(
          duplicateCanvasItems(
            Array.from(
              selectedItemIds as Set<string>
            )
          )
        );
      }
    }, [selectedItemIds, dispatch]);

  const handleSearch = useCallback(() => {
    // TODO Phase 4: search dialog
  }, []);

  return {
    handleSelectAll,
    handleDeleteSelected,
    handleDuplicateSelected,
    handleSearch,
  };
}
