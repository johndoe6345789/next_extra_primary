'use client'

/**
 * Alerts centre — unified notification
 * feed across all Nextra services.
 */

import { Alert, Typography } from '@shared/m3'
import { useTranslations } from 'next-intl'
import { useAlerts } from '@/hooks/useAlerts'
import { AlertList } from './AlertList'

export default function AlertsPage() {
  const {
    alerts, loading, error, unreadCount, markRead,
  } = useAlerts()
  const t = useTranslations('alerts')

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
            {t('pageTitle')}
            {unreadCount > 0 && (
              <Typography
                as="span"
                variant="caption"
                className="alerts-unread-count"
              >
                {' '}
                {t('unread', { count: unreadCount })}
              </Typography>
            )}
          </Typography>
        </div>
      </header>

      {error && (
        <Alert
          severity="error"
          title={t('error')}
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
            {t('loading')}
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
