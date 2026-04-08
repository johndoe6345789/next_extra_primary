/**
 * useRealtimeService Hook
 * Manages WebSocket connection
 */

import { useEffect, useRef } from 'react';
import type {
  RealtimeService,
  UseRealtimeServiceOptions,
} from './realtimeServiceTypes';
import { getUserColor, setupRealtimeSubscriptions } from './realtimeServiceConnection';
import { useRealtimeActions } from './realtimeServiceActions';

export type {
  ConnectedUser, CurrentUser, RealtimeService,
  RealtimeActions, UseRealtimeServiceOptions,
} from './realtimeServiceTypes';

/** Hook to manage realtime service connection */
export function useRealtimeService(
  options: UseRealtimeServiceOptions
) {
  const {
    projectId, enabled = true, onError,
    dispatch, user, connectedUsers,
    realtimeService, actions,
  } = options;

  const connectionRef =
    useRef<RealtimeService | null>(null);

  useEffect(() => {
    if (!enabled || !user || !projectId) return;
    try {
      const color = getUserColor(user.id);
      realtimeService.connect(projectId, user.id, user.name, color);
      connectionRef.current = realtimeService;
      setupRealtimeSubscriptions(realtimeService, dispatch, actions);
      return () => {
        realtimeService.disconnect();
        dispatch(actions.setConnected(false));
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('Realtime init:', err);
      onError?.(err);
    }
  }, [projectId, user, enabled, dispatch, onError, realtimeService, actions]);

  const rtActions = useRealtimeActions({
    connectionRef,
    realtimeService,
    dispatch,
    actions,
    user,
  });

  return {
    isConnected: connectionRef.current !== null,
    connectedUsers,
    ...rtActions,
  };
}

export default useRealtimeService;
