/**
 * Realtime service connection lifecycle
 */

import type { Socket } from 'socket.io-client';
import type { RealtimeSubscriptions } from
  './realtimeSubscription';
import { createSocket } from './realtimeConnect';

/** Connect params */
export interface ConnectParams {
  projectId: string;
  userId: string;
  userName: string;
  userColor: string;
}

/** Connect to realtime server */
export async function connectToServer(
  params: ConnectParams,
  subs: RealtimeSubscriptions
): Promise<Socket> {
  return createSocket(params, subs);
}

/** Disconnect from realtime server */
export function disconnectFromServer(
  socket: Socket | null
) {
  if (socket) {
    socket.disconnect();
  }
}
