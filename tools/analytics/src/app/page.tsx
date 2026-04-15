'use client'

/**
 * Analytics dashboard — admin view of platform
 * metric totals plus a daily-activity chart.
 */

import { useState } from 'react'
import { Alert, Typography } from '@shared/m3'
import { useAnalytics } from '@/hooks/useAnalytics'
import { MetricGrid } from './MetricGrid'
import { TimeSeriesChart } from './TimeSeriesChart'

export default function AnalyticsPage() {
  const {
    metrics, retention, loading, error,
  } = useAnalytics()
  const [sel, setSel] = useState('users')

  const active =
    metrics.find((m) => m.key === sel) ||
    metrics[0]

  return (
    <div className="analytics-shell">
      <header className="analytics-header">
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
        >
          insights
        </span>
        <Typography
          variant="h1"
          testId="analytics-heading"
        >
          Analytics
        </Typography>
        {retention > 0 && (
          <Typography
            as="span"
            variant="caption"
          >
            {` retention ${retention}d`}
          </Typography>
        )}
      </header>

      {error && (
        <Alert
          severity="error"
          title="Could not load analytics"
          testId="analytics-error"
        >
          {error}
        </Alert>
      )}

      {loading && !metrics.length ? (
        <Typography
          variant="body1"
          testId="analytics-loading"
        >
          Loading…
        </Typography>
      ) : (
        <>
          <MetricGrid
            metrics={metrics}
            selectedKey={sel}
            onSelect={setSel}
          />
          {active && (
            <TimeSeriesChart
              metricKey={active.key}
              label={active.label}
            />
          )}
        </>
      )}
    </div>
  )
}
