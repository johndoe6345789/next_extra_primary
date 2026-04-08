/**
 * Redux Slice for Real-time Collaboration State
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { realtimeInitialState } from './realtimeTypes';
import type { ConnectedUser } from './realtimeTypes';
import {
  updateRemoteCursorReducer,
  lockItemReducer,
  releaseItemReducer
} from './realtimeLockReducers';

export type { ConnectedUser } from './realtimeTypes';

export const realtimeSlice = createSlice({
  name: 'realtime',
  initialState: realtimeInitialState,
  reducers: {
    setConnected: (
      state, action: PayloadAction<boolean>
    ) => {
      state.isConnected = action.payload;
      state.error = null;
    },
    setError: (
      state, action: PayloadAction<string | null>
    ) => { state.error = action.payload; },
    addConnectedUser: (
      state, action: PayloadAction<ConnectedUser>
    ) => {
      if (!state.connectedUsers.find(
        (u) => u.userId === action.payload.userId
      )) {
        state.connectedUsers.push(action.payload);
      }
    },
    removeConnectedUser: (
      state, action: PayloadAction<string>
    ) => {
      state.connectedUsers =
        state.connectedUsers.filter(
          (u) => u.userId !== action.payload
        );
      state.remoteCursors.delete(action.payload);
      for (const [k, v] of
        state.lockedItems.entries()) {
        if (v === action.payload) {
          state.lockedItems.delete(k);
        }
      }
    },
    updateRemoteCursor: updateRemoteCursorReducer,
    lockItem: lockItemReducer,
    releaseItem: releaseItemReducer,
    clearRemoteCursor: (
      state, action: PayloadAction<string>
    ) => {
      state.remoteCursors.delete(action.payload);
    },
    clearAllRemote: (state) => {
      state.connectedUsers = [];
      state.remoteCursors.clear();
      state.lockedItems.clear();
    }
  }
});

export const {
  setConnected, setError,
  addConnectedUser, removeConnectedUser,
  updateRemoteCursor, lockItem, releaseItem,
  clearRemoteCursor, clearAllRemote
} = realtimeSlice.actions;

export {
  selectIsConnected, selectConnectedUsers,
  selectRemoteCursors, selectLockedItems
} from './realtimeSelectors';

export default realtimeSlice.reducer;
