'use client'

/**
 * TimeSeriesChart — minimal inline SVG line chart.
 * No heavy chart library; renders counts as a
 * polyline over a fixed viewport.
 */

import { Typography } from '@shared/m3'
import { useTimeSeries } from '@/hooks/useTimeSeries'

interface Props {
  metricKey: string
  label: string
}

const W = 600
const H = 180
const PAD = 24

/** Daily activity chart for one metric. */
export function TimeSeriesChart({
  metricKey, label,
}: Props) {
  const { points, loading, error } =
    useTimeSeries(metricKey, 30)

  const max = points.reduce(
    (m, p) => Math.max(m, p.count), 1,
  )
  const step =
    points.length > 1
      ? (W - PAD * 2) / (points.length - 1)
      : 0
  const path = points
    .map((p, i) => {
      const x = PAD + i * step
      const y =
        H - PAD -
        ((p.count / max) * (H - PAD * 2))
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

  return (
    <div
      className="analytics-chart"
      data-testid="timeseries-chart"
      aria-label={`${label} daily chart`}
    >
      <Typography variant="h3">
        {label} — last 30 days
      </Typography>
      {error && (
        <Typography
          variant="caption"
          testId="timeseries-error"
        >
          {error}
        </Typography>
      )}
      {loading && !points.length ? (
        <Typography variant="body2">
          Loading…
        </Typography>
      ) : (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="chart"
          width="100%"
          height={H}
        >
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}
