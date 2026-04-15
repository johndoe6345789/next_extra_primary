'use client'

/**
 * Hook: useAnalytics
 * Fetches the /api/analytics/summary totals
 * payload and surfaces loading + error state.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

export interface MetricRow {
  key: string
  label: string
  icon: string
  total: number
  missing: boolean
}

interface SummaryResponse {
  retentionDays: number
  metrics: MetricRow[]
}

const ENDPOINT = '/api/analytics/summary'

/** Load the analytics summary on mount. */
export function useAnalytics() {
  const [metrics, setMetrics] =
    useState<MetricRow[]>([])
  const [retention, setRetention] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(ENDPOINT, {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error(
          `Request failed: ${res.status}`,
        )
      }
      const data =
        (await res.json()) as SummaryResponse
      setMetrics(data.metrics || [])
      setRetention(data.retentionDays || 0)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return {
    metrics, retention, loading, error, refresh,
  }
}
