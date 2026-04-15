'use client'

/**
 * Deliveries tab — status filter,
 * table of webhook_deliveries rows,
 * and a selected-row detail panel.
 * The table markup lives in
 * DeliveriesTable.tsx so this file
 * can stay under the 100-LOC cap.
 */

import { useState } from 'react'
import {
  useDeliveries,
} from '@/hooks/useDeliveries'
import {
  DeliveriesTable,
} from './DeliveriesTable'
import {
  DeliveryDetail,
} from './DeliveryDetail'

interface Props {
  onReplay: (
    id: number,
  ) => Promise<boolean>
}

const STATUSES = [
  '', 'pending', 'retrying',
  'delivered', 'dead',
]

export function DeliveriesTab({
  onReplay,
}: Props) {
  const [status, setStatus] =
    useState('')
  const [selected, setSelected] =
    useState<number | null>(null)
  const { items } = useDeliveries(status)

  const row = items.find(
    (d) => d.id === selected,
  )

  return (
    <section
      aria-label="Webhook deliveries"
      data-testid="deliveries-tab"
    >
      <select
        aria-label="Filter status"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s || 'all'}
          </option>
        ))}
      </select>
      <DeliveriesTable
        items={items}
        onSelect={setSelected}
        onReplay={onReplay}
      />
      {row && (
        <DeliveryDetail row={row} />
      )}
    </section>
  )
}
