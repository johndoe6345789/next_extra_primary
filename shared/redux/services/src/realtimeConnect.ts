/**
 * Realtime socket connection factory
 */

import { io, Socket } from 'socket.io-client';
import type { RealtimeSubscriptions } from
  './realtimeSubscription';

/** Socket connection config */
export interface SocketConfig {
  projectId: string;
  userId: string;
  userName: string;
  userColor: string;
}

/** Create and connect a socket */
export function createSocket(
  config: SocketConfig,
  subs: RealtimeSubscriptions
): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const url =
      process.env.REACT_APP_API_URL ||
      'http://localhost:5000';
    const socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    socket.on('connect', () => {
      subs.notify('user_joined', {
        projectId: config.projectId,
        userId: config.userId,
        userName: config.userName,
        userColor: config.userColor,
      });
      resolve(socket);
    });
    socket.on('connect_error', reject);
    socket.on('disconnect', () =>
      subs.notify('user_disconnected', {
        userId: config.userId,
      }));
    for (const ev of [
      'user_joined', 'canvas_updated',
      'cursor_moved', 'item_locked',
      'item_released',
    ]) {
      socket.on(ev, (d) =>
        subs.notify(ev, d));
    }
  });
}
