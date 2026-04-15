'use client'

/**
 * OrdersTab — table of orders with drill-down to a
 * detail panel on the right-hand side.
 */

import { useState } from 'react'
import type { OrderRow } from '@/hooks/useOrders'
import OrderDetail from './OrderDetail'

export interface OrdersTabProps {
  items: OrderRow[]
}

/** List orders and show details of the selected row. */
export default function OrdersTab({
  items,
}: OrdersTabProps) {
  const [selected, setSelected] =
    useState<OrderRow | null>(null)

  return (
    <section
      className="shop-admin-orders"
      data-testid="orders-tab"
      aria-label="Orders"
    >
      <ul
        className="shop-admin-order-list"
        role="list"
      >
        {items.map((o) => (
          <li
            key={o.id}
            data-testid={`order-${o.id}`}
            aria-selected={selected?.id === o.id}
            onClick={() => setSelected(o)}
          >
            <span>#{o.id}</span>
            <span>{o.status}</span>
            <span>
              {(o.total_cents / 100).toFixed(2)}{' '}
              {o.currency}
            </span>
          </li>
        ))}
      </ul>
      {selected && (
        <OrderDetail order={selected} />
      )}
    </section>
  )
}
