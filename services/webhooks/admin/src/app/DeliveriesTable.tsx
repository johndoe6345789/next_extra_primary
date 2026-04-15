'use client'

/**
 * Pure table view of webhook deliveries.
 * Split out of DeliveriesTab so each
 * file can stay under the 100-LOC cap.
 */

import { Button } from
  '@shared/components/m3'
import type {
  Delivery,
} from '@/hooks/useDeliveries'

interface Props {
  items: Delivery[]
  onSelect: (id: number) => void
  onReplay: (
    id: number,
  ) => Promise<boolean>
}

export function DeliveriesTable({
  items, onSelect, onReplay,
}: Props) {
  return (
    <table
      className="webhooks-table"
      data-testid="deliveries-table"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Event</th>
          <th>Status</th>
          <th>Att.</th>
          <th>Code</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((d) => (
          <tr
            key={d.id}
            onClick={() =>
              onSelect(d.id)
            }
          >
            <td>{d.id}</td>
            <td>{d.event_type}</td>
            <td>{d.status}</td>
            <td>{d.attempts}</td>
            <td>
              {d.last_status_code}
            </td>
            <td>
              <Button
                variant="text"
                aria-label={
                  `Replay ${d.id}`
                }
                onClick={() =>
                  onReplay(d.id)
                }
              >
                Replay
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
