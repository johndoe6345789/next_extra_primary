'use client'

/**
 * Detail panel for a single webhook
 * delivery row — shows the full error
 * body and the retry timestamp that
 * would be truncated in the table view.
 */

import type {
  Delivery,
} from '@/hooks/useDeliveries'

interface Props {
  row: Delivery
}

export function DeliveryDetail({
  row,
}: Props) {
  return (
    <aside
      className="webhook-detail"
      data-testid="delivery-detail"
      aria-label="Delivery detail"
    >
      <h2>Delivery #{row.id}</h2>
      <dl>
        <dt>Endpoint</dt>
        <dd>{row.endpoint_id}</dd>
        <dt>Event</dt>
        <dd>{row.event_type}</dd>
        <dt>Status</dt>
        <dd>{row.status}</dd>
        <dt>Attempts</dt>
        <dd>{row.attempts}</dd>
        <dt>Last code</dt>
        <dd>{row.last_status_code}</dd>
        <dt>Next retry</dt>
        <dd>{row.next_retry_at}</dd>
        <dt>Delivered at</dt>
        <dd>
          {row.delivered_at || '—'}
        </dd>
        <dt>Last error</dt>
        <dd>
          <pre>
            {row.last_error || '—'}
          </pre>
        </dd>
      </dl>
    </aside>
  )
}
