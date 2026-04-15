'use client'

/**
 * ProductEditor — minimal form that PUTs or POSTs
 * a product row to the ecommerce API.
 */

import { useState } from 'react'
import { Button, TextField } from '@shared/m3'
import type { ProductRow } from '@/hooks/useProducts'

export interface ProductEditorProps {
  value: ProductRow
  onClose: () => void
}

/** Create or update a single product row. */
export default function ProductEditor({
  value,
  onClose,
}: ProductEditorProps) {
  const [row, setRow] = useState<ProductRow>(value)

  async function save(): Promise<void> {
    const isNew = row.id === 0
    const url = isNew
      ? '/api/shop/products'
      : `/api/shop/products/${row.id}`
    const method = isNew ? 'POST' : 'PUT'
    await fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(row),
    })
    onClose()
  }

  return (
    <div
      className="shop-admin-editor"
      role="dialog"
      aria-label="Edit product"
      data-testid="product-editor"
    >
      <TextField
        label="SKU"
        value={row.sku}
        onChange={(e) =>
          setRow({ ...row, sku: e.target.value })
        }
      />
      <TextField
        label="Name"
        value={row.name}
        onChange={(e) =>
          setRow({ ...row, name: e.target.value })
        }
      />
      <TextField
        label="Price (cents)"
        type="number"
        value={String(row.price_cents)}
        onChange={(e) =>
          setRow({
            ...row,
            price_cents: Number(e.target.value),
          })
        }
      />
      <TextField
        label="Stock"
        type="number"
        value={String(row.stock)}
        onChange={(e) =>
          setRow({
            ...row,
            stock: Number(e.target.value),
          })
        }
      />
      <div className="shop-admin-editor-actions">
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="filled" onClick={save}>
          Save
        </Button>
      </div>
    </div>
  )
}
