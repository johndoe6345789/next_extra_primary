'use client'

/**
 * JobsTab — lists image processing jobs, lets
 * the operator select one (for the Variants tab)
 * and retry a failed job.
 */

import { Button, Typography } from '@shared/m3'
import { useImageJobs } from '@/hooks/useImageJobs'

interface JobsTabProps {
  selectedId: number | null
  onSelect: (id: number) => void
}

export function JobsTab({
  selectedId,
  onSelect,
}: JobsTabProps) {
  const { items, retry } = useImageJobs()

  if (items.length === 0)
    return (
      <Typography variant="body2">
        No jobs yet.
      </Typography>
    )

  return (
    <table
      className="img-table"
      data-testid="jobs-table"
      aria-label="Image job ledger"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Source</th>
          <th>Status</th>
          <th>Attempts</th>
          <th>Error</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((row) => (
          <tr
            key={row.id}
            data-selected={
              row.id === selectedId
                ? 'true'
                : 'false'
            }
          >
            <td>
              <Button
                variant="text"
                onClick={() => onSelect(row.id)}
                data-testid={`select-${row.id}`}
              >
                {row.id}
              </Button>
            </td>
            <td>{row.source_url}</td>
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
