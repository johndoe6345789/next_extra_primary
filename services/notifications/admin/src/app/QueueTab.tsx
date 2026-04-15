'use client'

/**
 * Delivery queue view — lists recent
 * notification ledger rows and exposes a
 * retry action for failed deliveries.
 */

import { Button, Typography } from '@shared/m3'
import { useNotifQueue } from '@/hooks/useNotifQueue'

export function QueueTab() {
  const { items, retry } = useNotifQueue()

  if (items.length === 0)
    return (
      <Typography variant="body2">
        No notifications yet.
      </Typography>
    )

  return (
    <table
      className="notif-table"
      data-testid="queue-table"
      aria-label="Delivery ledger"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Channel</th>
          <th>Template</th>
          <th>Status</th>
          <th>Attempts</th>
          <th>Error</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.channel}</td>
            <td>{row.template}</td>
            <td data-status={row.status}>
              {row.status}
            </td>
            <td>{row.attempts}</td>
            <td>{row.error ?? ''}</td>
            <td>
              {row.status === 'failed' && (
                <Button
                  variant="text"
                  onClick={() => retry(row.id)}
                  data-testid={
                    `retry-${row.id}`
                  }
                >
                  Retry
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
