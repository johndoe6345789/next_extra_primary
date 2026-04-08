/**
 * Realtime broadcast and lock operations
 */

import type { Socket } from 'socket.io-client';

/** Broadcast a canvas item update */
export function broadcastCanvasUpdate(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  itemId: string,
  position?: { x: number; y: number },
  size?: { width: number; height: number }
) {
  if (!socket || !projectId) return;
  socket.emit('canvas_update', {
    projectId, userId, itemId,
    position, size,
    timestamp: new Date().toISOString(),
  });
}

/** Broadcast cursor position */
export function broadcastCursor(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  userName: string | null,
  userColor: string | null,
  x: number,
  y: number
) {
  if (!socket || !projectId) return;
  socket.emit('cursor_move', {
    projectId, userId, userName, userColor,
    position: { x, y },
    timestamp: new Date().toISOString(),
  });
}

/** Lock an item */
export function lockItem(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  userName: string | null,
  userColor: string | null,
  itemId: string
) {
  if (!socket || !projectId) return;
  socket.emit('item_locked', {
    projectId, userId, itemId,
    userName, userColor,
  });
}

/** Release an item lock */
export function releaseItem(
  socket: Socket | null,
  projectId: string | null,
  userId: string | null,
  itemId: string
) {
  if (!socket || !projectId) return;
  socket.emit('item_released', {
    projectId, userId, itemId,
  });
}
