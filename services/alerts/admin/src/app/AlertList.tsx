'use client'

/** Renders the alert list with M3 components. */
import {
  List, ListItemButton, ListItemText, Typography,
} from '@shared/m3'
import { useTranslations } from 'next-intl'
import type { AlertEntry } from '@/hooks/alertTypes'

const ICONS: Record<string, string> = {
  email: 'mail', system: 'info',
}

/** Format relative time via i18n. */
function useTimeAgo() {
  const t = useTranslations('alerts.time')
  return (ts: number): string => {
    const s = Math.floor((Date.now() - ts) / 1000)
    if (s < 60) return t('justNow')
    const m = Math.floor(s / 60)
    if (m < 60) return t('minutes', { m })
    const h = Math.floor(m / 60)
    if (h < 24) return t('hours', { h })
    return t('days', { d: Math.floor(h / 24) })
  }
}

/** Props for the AlertList component. */
export interface AlertListProps {
  /** Alerts to render. */
  alerts: AlertEntry[]
  /** Invoked when a row is activated. */
  onMarkRead: (id: string) => void
}

/** List of alert rows backed by M3 List. */
export function AlertList({
  alerts, onMarkRead,
}: AlertListProps) {
  const t = useTranslations('alerts')
  const timeAgo = useTimeAgo()
  if (alerts.length === 0) {
    return (
      <div className="alerts-empty"
        data-testid="alerts-empty"
        aria-label={t('noneAria')}>
        <span className={
          'material-symbols-outlined ' +
          'alerts-empty-icon'
        } aria-hidden="true">
          notifications_off
        </span>
        <Typography variant="body1">
          {t('noneOpen')}
        </Typography>
      </div>
    )
  }

  return (
    <List
      className="alerts-list"
      aria-label={t('ariaList')}
      testId="alerts-list"
    >
      {alerts.map(a => (
        <ListItemButton
          key={a.id}
          href={a.link ?? '#'}
          onClick={() => onMarkRead(a.id)}
          className={
            'alert-item' +
            (a.isRead ? '' : ' alert-item--unread')
          }
          aria-label={`${a.source}: ${a.title}`}
          data-testid={`alert-${a.id}`}
        >
          <span
            className={
              'material-symbols-outlined alert-dot'
            }
            aria-hidden="true"
          >
            {ICONS[a.type] ?? 'circle'}
          </span>
          <ListItemText
            primary={a.title}
            secondary={`${a.source} · ${a.detail}`}
          />
          <Typography
            variant="caption"
            className="alert-time"
          >
            {timeAgo(a.timestamp)}
          </Typography>
        </ListItemButton>
      ))}
    </List>
  )
}
