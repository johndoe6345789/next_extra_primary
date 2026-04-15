'use client'

/**
 * useProducts — polls the ecommerce API for the
 * list of products and exposes a reload action.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const API = '/api/shop/products'
const POLL_MS = 10_000

export interface ProductRow {
  id: number
  sku: string
  name: string
  description: string
  price_cents: number
  currency: string
  stock: number
  active: boolean
}

/** Load + auto-poll the product catalog. */
export function useProducts() {
  const [items, setItems] = useState<ProductRow[]>([])

  const reload = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (!r.ok) return
      const j = (await r.json()) as {
        items: ProductRow[]
      }
      setItems(j.items ?? [])
    } catch {
      /* transient network error — retry on next tick */
    }
  }, [])

  useEffect(() => {
    reload()
    const id = setInterval(reload, POLL_MS)
    return () => clearInterval(id)
  }, [reload])

  return { items, reload }
}
