/**
 * Convenience notification dispatchers
 */

import { useCallback } from 'react';
import type { NotificationType }
  from './uiNotificationsTypes';

type NotifyFn = (
  msg: string,
  type?: NotificationType,
  dur?: number
) => void;

/**
 * Build typed shortcut methods
 * @param notify - Base notification dispatch
 */
export function useNotifyShortcuts(
  notify: NotifyFn
) {
  const success = useCallback(
    (msg: string, dur?: number) =>
      notify(msg, 'success', dur),
    [notify]
  );
  const error = useCallback(
    (msg: string, dur?: number) =>
      notify(msg, 'error', dur),
    [notify]
  );
  const warning = useCallback(
    (msg: string, dur?: number) =>
      notify(msg, 'warning', dur),
    [notify]
  );
  const info = useCallback(
    (msg: string, dur?: number) =>
      notify(msg, 'info', dur),
    [notify]
  );

  return { success, error, warning, info };
}
