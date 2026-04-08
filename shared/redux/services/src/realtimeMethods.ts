/**
 * Realtime service broadcast helper methods
 */

import type { Socket } from 'socket.io-client';
import {
  broadcastCanvasUpdate, broadcastCursor,
  lockItem as emitLock,
  releaseItem as emitRelease,
} from './realtimeBroadcast';

/** Broadcast a canvas item update */
export function emitCanvasUpdate(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  itemId: string,
  pos?: { x: number; y: number },
  size?: { width: number; height: number }
) {
  broadcastCanvasUpdate(
    socket, projectId, userId,
    itemId, pos, size
  );
}

/** Broadcast cursor position (throttled) */
export function emitCursorPosition(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  userName: string | null,
  userColor: string | null,
  x: number, y: number,
  cursorTs: number,
  throttleMs: number
): number {
  if (!socket || !projectId) return cursorTs;
  const now = Date.now();
  if (now - cursorTs < throttleMs) return cursorTs;
  broadcastCursor(
    socket, projectId, userId,
    userName, userColor, x, y
  );
  return now;
}

/** Lock an item for editing */
export function emitItemLock(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  userName: string | null,
  userColor: string | null,
  id: string
) {
  emitLock(
    socket, projectId, userId,
    userName, userColor, id
  );
}

/** Release an item lock */
export function emitItemRelease(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  id: string
) {
  emitRelease(socket, projectId, userId, id);
}
