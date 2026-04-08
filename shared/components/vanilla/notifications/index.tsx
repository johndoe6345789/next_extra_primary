/**
 * Notification Components
 *
 * Generic notification system - framework agnostic.
 * Supports multiple positions and auto-dismiss.
 */

export type {
  NotificationType,
  NotificationPosition,
  NotificationData,
  NotificationContainerProps,
  NotificationItemProps,
} from './types'

export { NotificationItem } from './NotificationItem'
export {
  NotificationContainer,
} from './NotificationContainer'
export {
  useNotificationState,
} from './useNotificationState'

/** CSS keyframes for notification animations. */
export const notificationStyles = `
@keyframes notification-slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-testid^="notification-"] {
    animation: none;
  }
}
`

export default NotificationContainer
