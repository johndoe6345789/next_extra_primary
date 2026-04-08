/**
 * Realtime event subscription management
 */

import type { RealtimeListener } from
  './realtimeTypes';

/** Manages event listeners for realtime */
export class RealtimeSubscriptions {
  private listeners: Map<
    string, Set<RealtimeListener>
  > = new Map();

  /** Subscribe to an event */
  subscribe(
    event: string, listener: RealtimeListener
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /** Unsubscribe from an event */
  unsubscribe(
    event: string, listener: RealtimeListener
  ) {
    this.listeners.get(event)?.delete(listener);
  }

  /** Notify all listeners of an event */
  notify(event: string, data: unknown) {
    this.listeners.get(event)?.forEach(
      (fn) => fn(data)
    );
  }

  /** Clear all listeners */
  clear() {
    this.listeners.clear();
  }
}
