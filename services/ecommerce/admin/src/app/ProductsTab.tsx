'use client'

/**
 * ProductsTab — grid of product cards plus an
 * inline editor for creating / editing rows.
 */

import { useState } from 'react'
import { Button } from '@shared/m3'
import type { ProductRow } from '@/hooks/useProducts'
import ProductEditor from './ProductEditor'

export interface ProductsTabProps {
  items: ProductRow[]
  reload: () => void
}

/** List products with inline create/edit flows. */
export default function ProductsTab({
  items,
  reload,
}: ProductsTabProps) {
  const [editing, setEditing] =
    useState<ProductRow | null>(null)

  return (
    <section
      className="shop-admin-products"
      data-testid="products-tab"
      aria-label="Product catalog"
    >
      <div className="shop-admin-toolbar">
        <Button
          variant="filled"
          data-testid="product-new"
          onClick={() =>
            setEditing({
              id: 0,
              sku: '',
              name: '',
              description: '',
              price_cents: 0,
              currency: 'USD',
              stock: 0,
              active: true,
            })
          }
        >
          New product
        </Button>
      </div>

      <ul
        className="shop-admin-product-list"
        role="list"
      >
        {items.map((p) => (
          <li
            key={p.id}
            data-testid={`product-${p.id}`}
          >
            <span>{p.sku}</span>
            <strong>{p.name}</strong>
            <span>
              {(p.price_cents / 100).toFixed(2)}{' '}
              {p.currency}
            </span>
            <Button
              variant="text"
              onClick={() => setEditing(p)}
              aria-label={`Edit ${p.name}`}
            >
              Edit
            </Button>
          </li>
        ))}
      </ul>

      {editing && (
        <ProductEditor
          value={editing}
          onClose={() => {
            setEditing(null)
            reload()
          }}
        />
      )}
    </section>
  )
}
