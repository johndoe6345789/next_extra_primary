/**
 * Realtime broadcast callbacks
 */

import { useCallback } from 'react';
import type {
  RealtimeService,
} from './realtimeServiceTypes';

/**
 * Create broadcast callbacks for realtime
 * @param connectionRef - Active connection ref
 * @param realtimeService - Service instance
 */
export function useRealtimeBroadcast(
  connectionRef: React.RefObject<
    RealtimeService | null
  >,
  realtimeService: RealtimeService
) {
  /** Broadcast a canvas item update */
  const broadcastCanvasUpdate = useCallback(
    (
      itemId: string,
      position: { x: number; y: number },
      size: { width: number; height: number }
    ) => {
      if (!connectionRef.current) return;
      realtimeService.broadcastCanvasUpdate(
        itemId,
        position,
        size
      );
    },
    [connectionRef, realtimeService]
  );

  /** Broadcast cursor position */
  const broadcastCursorPosition = useCallback(
    (x: number, y: number) => {
      if (!connectionRef.current) return;
      realtimeService.broadcastCursorPosition(
        x,
        y
      );
    },
    [connectionRef, realtimeService]
  );

  return {
    broadcastCanvasUpdate,
    broadcastCursorPosition,
  };
}
