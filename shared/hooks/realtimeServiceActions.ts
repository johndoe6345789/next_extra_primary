/**
 * Realtime service broadcast/lock callbacks
 */

import { useCallback } from 'react';
import type {
  RealtimeService,
  RealtimeActions,
  CurrentUser,
} from './realtimeServiceTypes';
import { useRealtimeBroadcast } from './realtimeBroadcast';

interface ActionsDeps {
  connectionRef: React.RefObject<
    RealtimeService | null
  >;
  realtimeService: RealtimeService;
  dispatch: (action: unknown) => void;
  actions: RealtimeActions;
  user: CurrentUser | null | undefined;
}

/** Create broadcast and lock callbacks */
export function useRealtimeActions(
  deps: ActionsDeps
) {
  const {
    connectionRef,
    realtimeService,
    dispatch,
    actions,
    user,
  } = deps;

  const {
    broadcastCanvasUpdate,
    broadcastCursorPosition,
  } = useRealtimeBroadcast(
    connectionRef,
    realtimeService
  );

  const lockCanvasItem = useCallback(
    (itemId: string) => {
      if (!connectionRef.current || !user) {
        return;
      }
      realtimeService.lockItem(itemId);
      dispatch(
        actions.lockItem({
          itemId,
          userId: user.id,
        })
      );
    },
    [
      connectionRef, dispatch,
      user, realtimeService, actions,
    ]
  );

  const releaseCanvasItem = useCallback(
    (itemId: string) => {
      if (!connectionRef.current) return;
      realtimeService.releaseItem(itemId);
      dispatch(actions.releaseItem(itemId));
    },
    [
      connectionRef, dispatch,
      realtimeService, actions,
    ]
  );

  return {
    broadcastCanvasUpdate, lockCanvasItem,
    broadcastCursorPosition, releaseCanvasItem,
  };
}
