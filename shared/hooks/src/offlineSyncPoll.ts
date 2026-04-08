'use client'

/**
 * Polling effect for offline sync
 */

import { useEffect } from 'react'
import { POLL_INTERVAL_MS } from './offlineSyncTypes'
import { SyncQueue } from './useSyncQueue'

/** Poll health and auto-sync on reconnect */
export function useOfflineSyncPoll(
  checkHealth: () => Promise<boolean>,
  syncNow: () => Promise<number>,
  setIsOnline: (v: boolean) => void,
  setPendingCount: (v: number) => void
): void {
  useEffect(() => {
    let mounted = true
    const wasOnline = { current: true }
    const poll = async () => {
      if (!mounted) return
      const online = await checkHealth()
      if (!mounted) return
      setIsOnline(online)
      if (online && !wasOnline.current) {
        syncNow()
      }
      wasOnline.current = online
      const q = SyncQueue.getInstance()
      const c = await q.count()
      if (mounted) setPendingCount(c)
    }
    poll()
    const id = setInterval(
      poll,
      POLL_INTERVAL_MS
    )
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [
    checkHealth,
    syncNow,
    setIsOnline,
    setPendingCount,
  ])
}
