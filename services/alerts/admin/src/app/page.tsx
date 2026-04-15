'use client'

/**
 * Alerts centre — unified notification
 * feed across all Nextra services.
 */

import { Alert, Typography } from '@shared/m3'
import { useAlerts } from '@/hooks/useAlerts'
import { AlertList } from './AlertList'

export default function AlertsPage() {
  const {
    alerts, loading, error, unreadCount, markRead,
  } = useAlerts()

  return (
    <div className="alerts-shell">
      <header className="alerts-header">
        <div className="alerts-title">
          <span className={
            'material-symbols-outlined ' +
            'alerts-icon'
          } aria-hidden="true">
            notifications
          </span>
          <Typography
            variant="h1"
            testId="alerts-heading"
          >
            Alerts
            {unreadCount > 0 && (
              <Typography
                as="span"
                variant="caption"
                className="alerts-unread-count"
              >
                {` ${unreadCount} unread`}
              </Typography>
            )}
          </Typography>
        </div>
      </header>

      {error && (
        <Alert
          severity="error"
          title="Could not load alerts"
          testId="alerts-error"
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <div
          className="alerts-empty"
          data-testid="alerts-loading"
        >
          <Typography variant="body1">
            Loading…
          </Typography>
        </div>
      ) : (
        <AlertList
          alerts={alerts}
          onMarkRead={markRead}
        />
      )}
    </div>
  )
}
