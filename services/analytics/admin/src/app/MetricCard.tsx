'use client'

/**
 * MetricCard — displays a single metric total.
 * Uses M3 Typography; no raw elements.
 */

import { Typography } from '@shared/m3'
import type { MetricRow } from '@/hooks/useAnalytics'

interface Props {
  metric: MetricRow
  selected: boolean
  onSelect: (key: string) => void
}

/** Single metric tile in the analytics grid. */
export function MetricCard({
  metric, selected, onSelect,
}: Props) {
  const cls =
    'analytics-card' +
    (metric.missing
      ? ' analytics-card--missing' : '') +
    (selected
      ? ' analytics-card--selected' : '')
  return (
    <div
      className={cls}
      data-testid={
        `metric-card-${metric.key}`
      }
      aria-label={`${metric.label} metric`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(metric.key)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' ||
            e.key === ' ') {
          onSelect(metric.key)
        }
      }}
    >
      <div className="analytics-card__label">
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
        >
          {metric.icon}
        </span>
        <Typography variant="caption">
          {metric.label}
        </Typography>
      </div>
      <Typography
        as="span"
        variant="h2"
        className="analytics-card__total"
      >
        {metric.missing
          ? '—'
          : metric.total.toLocaleString()}
      </Typography>
    </div>
  )
}
