'use client'

/**
 * OrderDetail — read-only view of a single order
 * including its line items and Stripe PI id.
 */

import type { OrderRow } from '@/hooks/useOrders'

export interface OrderDetailProps {
  order: OrderRow
}

/** Display an order's metadata and line items. */
export default function OrderDetail({
  order,
}: OrderDetailProps) {
  return (
    <aside
      className="shop-admin-order-detail"
      data-testid={`order-detail-${order.id}`}
      aria-label={`Order ${order.id} detail`}
    >
      <h2>Order #{order.id}</h2>
      <dl>
        <dt>Status</dt>
        <dd>{order.status}</dd>
        <dt>User</dt>
        <dd>{order.user_id}</dd>
        <dt>Total</dt>
        <dd>
          {(order.total_cents / 100).toFixed(2)}{' '}
          {order.currency}
        </dd>
        <dt>Stripe PI</dt>
        <dd>{order.stripe_pi || '—'}</dd>
      </dl>
      <h3>Lines</h3>
      <ul role="list">
        {order.lines.map((l) => (
          <li key={l.product_id}>
            Product {l.product_id} × {l.qty}
            {' · '}
            {(l.price_cents / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </aside>
  )
}
