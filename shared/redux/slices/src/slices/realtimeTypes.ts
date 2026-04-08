/**
 * Type definitions for real-time collaboration
 */

/** Connected user presence */
export interface ConnectedUser {
  userId: string;
  userName: string;
  userColor: string;
  cursorPosition?: { x: number; y: number };
  lockedItemId?: string;
}

/** Real-time state shape */
export interface RealtimeState {
  isConnected: boolean;
  connectedUsers: ConnectedUser[];
  remoteCursors: Map<
    string,
    { x: number; y: number }
  >;
  lockedItems: Map<string, string>;
  error: string | null;
}

/** Initial real-time state */
export const realtimeInitialState: RealtimeState = {
  isConnected: false,
  connectedUsers: [],
  remoteCursors: new Map(),
  lockedItems: new Map(),
  error: null
};
