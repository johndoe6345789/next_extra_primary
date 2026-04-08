/**
 * Lock and cursor reducers for realtime slice
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RealtimeState } from './realtimeTypes';

/** Update a remote user's cursor position */
export const updateRemoteCursorReducer = (
  state: RealtimeState,
  action: PayloadAction<{
    userId: string;
    position: { x: number; y: number }
  }>
) => {
  state.remoteCursors.set(
    action.payload.userId,
    action.payload.position
  );
  const u = state.connectedUsers.find(
    (u) => u.userId === action.payload.userId
  );
  if (u) u.cursorPosition =
    action.payload.position;
};

/** Lock an item for a user */
export const lockItemReducer = (
  state: RealtimeState,
  action: PayloadAction<{
    itemId: string; userId: string
  }>
) => {
  state.lockedItems.set(
    action.payload.itemId,
    action.payload.userId
  );
  const u = state.connectedUsers.find(
    (u) => u.userId === action.payload.userId
  );
  if (u) u.lockedItemId =
    action.payload.itemId;
};

/** Release an item lock */
export const releaseItemReducer = (
  state: RealtimeState,
  action: PayloadAction<string>
) => {
  const uid =
    state.lockedItems.get(action.payload);
  state.lockedItems.delete(action.payload);
  if (uid) {
    const u = state.connectedUsers.find(
      (u) => u.userId === uid
    );
    if (u) u.lockedItemId = undefined;
  }
};
