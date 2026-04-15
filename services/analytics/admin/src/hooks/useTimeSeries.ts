'use client'

/**
 * Hook: useTimeSeries
 * Fetches day-bucket points for a single metric
 * key from /api/analytics/series.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

export interface SeriesPoint {
  day: string
  count: number
}

interface SeriesResponse {
  key: string
  label: string
  missing: boolean
  points: SeriesPoint[]
}

/** Load daily series for a given metric key. */
export function useTimeSeries(
  key: string, days = 30,
) {
  const [points, setPoints] =
    useState<SeriesPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!key) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/analytics/series?key=${key}` +
        `&days=${days}`,
        { credentials: 'include' },
      )
      if (!res.ok) {
        throw new Error(
          `Series failed: ${res.status}`,
        )
      }
      const data =
        (await res.json()) as SeriesResponse
      setPoints(data.points || [])
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [key, days])

  useEffect(() => { refresh() }, [refresh])

  return { points, loading, error, refresh }
}
