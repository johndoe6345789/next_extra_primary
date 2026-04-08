/** Notification settings state shape. */
export interface NotificationSettingsState {
  workflowExecuted: boolean;
  workflowFailed: boolean;
  projectShared: boolean;
  collaboratorJoined: boolean;
  emailExecutionSummary: boolean;
  emailWeeklyDigest: boolean;
  emailSecurityAlerts: boolean;
  emailProductUpdates: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
}

/** Default notification settings values. */
export const DEFAULT_NOTIFICATION_SETTINGS:
  NotificationSettingsState = {
    workflowExecuted: true,
    workflowFailed: true,
    projectShared: true,
    collaboratorJoined: true,
    emailExecutionSummary: true,
    emailWeeklyDigest: true,
    emailSecurityAlerts: true,
    emailProductUpdates: false,
    soundEnabled: true,
    desktopNotifications: true,
  };
