'use client'

/**
 * useOrders — polls the ecommerce API admin route
 * for all orders. Used by the operator tool.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const API = '/api/shop/admin/orders'
const POLL_MS = 10_000

export interface OrderLine {
  product_id: number
  qty: number
  price_cents: number
}

export interface OrderRow {
  id: number
  user_id: number
  status: string
  total_cents: number
  currency: string
  stripe_pi: string
  lines: OrderLine[]
}

/** Load + auto-poll the admin orders feed. */
export function useOrders() {
  const [items, setItems] = useState<OrderRow[]>([])

  const reload = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (!r.ok) return
      const j = (await r.json()) as {
        items: OrderRow[]
      }
      setItems(j.items ?? [])
    } catch {
      /* transient network error — retry next tick */
    }
  }, [])

  useEffect(() => {
    reload()
    const id = setInterval(reload, POLL_MS)
    return () => clearInterval(id)
  }, [reload])

  return { items, reload }
}
