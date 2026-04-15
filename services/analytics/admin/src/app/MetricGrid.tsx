'use client'

/**
 * MetricGrid — renders every metric card.
 * Purely presentational; delegates selection
 * back up so the parent can swap time series.
 */

import { MetricCard } from './MetricCard'
import type { MetricRow } from '@/hooks/useAnalytics'

interface Props {
  metrics: MetricRow[]
  selectedKey: string
  onSelect: (key: string) => void
}

/** Responsive grid of metric tiles. */
export function MetricGrid({
  metrics, selectedKey, onSelect,
}: Props) {
  return (
    <div
      className="analytics-grid"
      data-testid="metric-grid"
      aria-label="Platform metric totals"
    >
      {metrics.map((m) => (
        <MetricCard
          key={m.key}
          metric={m}
          selected={m.key === selectedKey}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
