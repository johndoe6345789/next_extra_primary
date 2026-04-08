/**
 * Realtime event subscription handlers
 */

import type {
  RealtimeService,
  RealtimeActions,
} from './realtimeServiceTypes';

type D = Record<string, unknown>;

/** Subscribe to user join/leave events */
export function subscribeUserEvents(
  service: RealtimeService,
  dispatch: (action: any) => void,
  actions: RealtimeActions
): void {
  service.subscribe(
    'user_joined',
    (raw) => {
      const d = raw as D;
      dispatch(
        actions.addConnectedUser({
          userId: d.userId as string,
          userName: d.userName as string,
          userColor:
            (d.userColor as string) || '#999',
          cursorPosition: undefined,
        })
      );
    }
  );

  service.subscribe(
    'user_left',
    (raw) => {
      const d = raw as D;
      dispatch(
        actions.removeConnectedUser(
          d.userId as string
        )
      );
    }
  );
}

/** Subscribe to canvas events */
export function subscribeCanvasEvents(
  service: RealtimeService,
  dispatch: (action: any) => void,
  actions: RealtimeActions
): void {
  service.subscribe(
    'cursor_moved',
    (raw) => {
      const d = raw as D;
      dispatch(
        actions.updateRemoteCursor({
          userId: d.userId as string,
          position: d.position as {
            x: number;
            y: number;
          },
        })
      );
    }
  );

  service.subscribe(
    'item_locked',
    (raw) => {
      const d = raw as D;
      dispatch(
        actions.lockItem({
          itemId: d.itemId as string,
          userId: d.userId as string,
        })
      );
    }
  );

  service.subscribe(
    'item_released',
    (raw) => {
      const d = raw as D;
      dispatch(
        actions.releaseItem(
          d.itemId as string
        )
      );
    }
  );
}
