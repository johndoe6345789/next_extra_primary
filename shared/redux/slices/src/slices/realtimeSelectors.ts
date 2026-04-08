/**
 * Selectors for real-time collaboration state
 */

import type { RealtimeState } from './realtimeTypes';

/** Select connection status */
export const selectIsConnected = (
  state: { realtime: RealtimeState }
) => state.realtime.isConnected;

/** Select connected users list */
export const selectConnectedUsers = (
  state: { realtime: RealtimeState }
) => state.realtime.connectedUsers;

/** Select remote cursors as array */
export const selectRemoteCursors = (
  state: { realtime: RealtimeState }
) =>
  Array.from(
    state.realtime.remoteCursors.entries()
  ).map(([userId, position]) => ({
    userId,
    position
  }));

/** Select locked items as array */
export const selectLockedItems = (
  state: { realtime: RealtimeState }
) =>
  Array.from(
    state.realtime.lockedItems.entries()
  ).map(([itemId, userId]) => ({
    itemId,
    userId
  }));
