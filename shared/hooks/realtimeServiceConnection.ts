/**
 * Realtime service connection setup logic
 */

import type {
  RealtimeService,
  RealtimeActions,
} from './realtimeServiceTypes';
import {
  subscribeUserEvents,
  subscribeCanvasEvents,
} from './realtimeSubscriptionHandlers';

/** Generate a deterministic color from user ID */
export function getUserColor(
  userId: string
): string {
  const hash = userId
    .split('')
    .reduce((acc, char) => {
      return (
        ((acc << 5) - acc) +
        char.charCodeAt(0)
      );
    }, 0);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/** Set up realtime event subscriptions */
export function setupRealtimeSubscriptions(
  service: RealtimeService,
  dispatch: (action: unknown) => void,
  actions: RealtimeActions
): void {
  service.subscribe('connected', () => {
    dispatch(actions.setConnected(true));
  });

  service.subscribe('disconnected', () => {
    dispatch(actions.setConnected(false));
  });

  subscribeUserEvents(
    service, dispatch, actions
  );
  subscribeCanvasEvents(
    service, dispatch, actions
  );
}
