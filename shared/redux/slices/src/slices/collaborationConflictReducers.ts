/**
 * Conflict-related reducers for collaboration
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { ConflictItem } from '../types/project';

/** State shape for conflict fields */
interface ConflictState {
  conflicts: ConflictItem[];
  hasUnresolvedConflicts: boolean;
}

/** Add a conflict if not duplicate */
export const addConflictReducer = (
  state: any,
  action: PayloadAction<ConflictItem>
) => {
  if (!state.conflicts.find(
    (c: ConflictItem) => c.itemId === action.payload.itemId
  )) {
    state.conflicts.push(action.payload);
    state.hasUnresolvedConflicts = true;
  }
};

/** Resolve a single conflict */
export const resolveConflictReducer = (
  state: any,
  action: PayloadAction<string>
) => {
  state.conflicts = state.conflicts.filter(
    (c: ConflictItem) => c.itemId !== action.payload
  );
  state.hasUnresolvedConflicts =
    state.conflicts.length > 0;
};

/** Update conflict resolution strategy */
export const updateConflictResolutionReducer = (
  state: any,
  action: PayloadAction<{
    itemId: string;
    resolution: 'local' | 'remote' | 'merge';
  }>
) => {
  const c = state.conflicts.find(
    (c: ConflictItem) => c.itemId === action.payload.itemId
  );
  if (c) c.resolution =
    action.payload.resolution;
};
