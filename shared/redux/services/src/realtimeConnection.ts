/**
 * Realtime connection and broadcasting
 */

import type { Socket } from 'socket.io-client';
import type { RealtimeListener } from
  './realtimeTypes';
import {
  emitCanvasUpdate, emitCursorPosition,
  emitItemLock, emitItemRelease,
} from './realtimeMethods';
import { RealtimeSubscriptions } from
  './realtimeSubscription';
import { connectToServer,
  disconnectFromServer,
} from './realtimeLifecycle';

/** Realtime WebSocket service */
export class RealtimeService {
  private socket: Socket | null = null;
  private projectId: string | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private userColor: string | null = null;
  private subs = new RealtimeSubscriptions();
  private cursorTs = 0;
  private readonly THROTTLE = 50;

  async connect(
    pid: string, uid: string,
    uname: string, color = '#1976d2'
  ) {
    this.projectId = pid;
    this.userId = uid;
    this.userName = uname;
    this.userColor = color;
    this.socket = await connectToServer(
      { projectId: pid, userId: uid,
        userName: uname, userColor: color },
      this.subs);
  }

  disconnect() {
    disconnectFromServer(this.socket);
    this.socket = null;
    this.projectId = null;
  }

  broadcastCanvasUpdate(
    itemId: string,
    pos?: { x: number; y: number },
    size?: { width: number; height: number }
  ) {
    emitCanvasUpdate(
      this.socket, this.projectId,
      this.userId, itemId, pos, size);
  }

  broadcastCursorPosition(
    x: number, y: number
  ) {
    this.cursorTs = emitCursorPosition(
      this.socket, this.projectId,
      this.userId, this.userName,
      this.userColor, x, y,
      this.cursorTs, this.THROTTLE);
  }

  lockItem(id: string) {
    emitItemLock(
      this.socket, this.projectId,
      this.userId, this.userName,
      this.userColor, id);
  }

  releaseItem(id: string) {
    emitItemRelease(
      this.socket, this.projectId,
      this.userId, id);
  }

  subscribe(ev: string, fn: RealtimeListener) {
    this.subs.subscribe(ev, fn);
  }

  unsubscribe(
    ev: string, fn: RealtimeListener
  ) { this.subs.unsubscribe(ev, fn); }
}
