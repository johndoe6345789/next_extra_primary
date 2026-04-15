'use client'

/**
 * Renders the list of alert entries.
 */

import type { AlertEntry } from '@/hooks/useAlerts'

/** Format relative time (e.g. "2m ago"). */
function timeAgo(ts: number): string {
  const s = Math.floor(
    (Date.now() - ts) / 1000,
  )
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

const ICONS: Record<string, string> = {
  email: 'mail',
  system: 'info',
}

interface AlertListProps {
  alerts: AlertEntry[]
  onMarkRead: (id: string) => void
}

export function AlertList({
  alerts, onMarkRead,
}: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="alerts-empty">
        <span className={
          'material-symbols-outlined ' +
          'alerts-empty-icon'
        }>
          notifications_off
        </span>
        <p>No alerts right now</p>
      </div>
    )
  }

  return (
    <div className="alerts-list">
      {alerts.map(a => (
        <a
          key={a.id}
          href={a.link ?? '#'}
          className={
            'alert-item' +
            (a.isRead
              ? '' : ' alert-item--unread')
          }
          onClick={() => onMarkRead(a.id)}
          data-testid={`alert-${a.id}`}
        >
          <span className={
            'material-symbols-outlined ' +
            'alert-dot'
          }
          style={{
            fontSize: 20,
            background: 'none',
            width: 'auto',
            height: 'auto',
          }}>
            {ICONS[a.type] ?? 'circle'}
          </span>
          <div className="alert-body">
            <div className="alert-subject">
              <span
                className="alert-source-tag"
                data-source={a.type}
              >
                {a.source}
              </span>
              {a.title}
            </div>
            <div className="alert-meta">
              {a.detail}
            </div>
          </div>
          <span className="alert-time">
            {timeAgo(a.timestamp)}
          </span>
        </a>
      ))}
    </div>
  )
}
