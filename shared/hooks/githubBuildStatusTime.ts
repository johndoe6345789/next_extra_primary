/**
 * Time formatting for build status
 */

import { useCallback } from 'react'
import copy from '@/data/github-build-status.json'

/** Format relative time from date string */
export function useTimeFormatter() {
  const fmtCount = useCallback(
    (t: string, n: number) =>
      t.replace('{count}', n.toString()),
    []
  )

  const formatTime = useCallback(
    (dateString: string) => {
      const d = new Date(dateString)
      const diff = Date.now() - d.getTime()
      const mins = Math.floor(diff / 60000)
      const hrs = Math.floor(mins / 60)
      const days = Math.floor(hrs / 24)
      if (days > 0) {
        return fmtCount(
          copy.time.daysAgo, days
        )
      }
      if (hrs > 0) {
        return fmtCount(
          copy.time.hoursAgo, hrs
        )
      }
      if (mins > 0) {
        return fmtCount(
          copy.time.minutesAgo, mins
        )
      }
      return copy.time.justNow
    },
    [fmtCount]
  )

  return formatTime
}
