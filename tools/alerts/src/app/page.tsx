'use client'

/**
 * Alerts centre — unified notification
 * feed across all Nextra services.
 */

import { useAlerts } from '@/hooks/useAlerts'
import { AlertList } from './AlertList'

export default function AlertsPage() {
  const {
    alerts, loading, unreadCount, markRead,
  } = useAlerts()

  return (
    <div className="alerts-shell">
      <header className="alerts-header">
        <div className="alerts-title">
          <span className={
            'material-symbols-outlined ' +
            'alerts-icon'
          }>
            notifications
          </span>
          <h1 style={{ margin: 0 }}>
            Alerts
            {unreadCount > 0 && (
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                marginLeft: 8,
                opacity: 0.7,
              }}>
                {unreadCount} unread
              </span>
            )}
          </h1>
        </div>
      </header>

      {loading ? (
        <div className="alerts-empty">
          Loading…
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
