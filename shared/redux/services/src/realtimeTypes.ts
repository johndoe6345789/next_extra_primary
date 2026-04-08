/**
 * Realtime service type definitions
 */

/** Remote user presence info */
export interface RemoteUser {
  userId: string;
  userName: string;
  userColor: string;
  connectedAt: string;
}

/** Remote cursor position */
export interface RemoteCursor {
  userId: string;
  userName: string;
  userColor: string;
  position: { x: number; y: number };
  timestamp: string;
}

/** Event listener callback */
export type RealtimeListener = (
  data: unknown
) => void;
