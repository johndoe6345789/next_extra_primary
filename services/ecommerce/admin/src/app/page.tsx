'use client'

/**
 * Shop admin root page — tabbed dashboard over
 * products and orders, matching the layout of
 * the other operator tools.
 */

import { useState } from 'react'
import { Button } from '@shared/m3'
import { useProducts } from '@/hooks/useProducts'
import { useOrders } from '@/hooks/useOrders'
import ProductsTab from './ProductsTab'
import OrdersTab from './OrdersTab'

type Tab = 'products' | 'orders'

export default function ShopAdminPage() {
  const [tab, setTab] = useState<Tab>('products')
  const products = useProducts()
  const orders = useOrders()

  return (
    <main className="shop-admin-shell">
      <h1>Shop Admin</h1>
      <div
        className="shop-admin-tabs"
        role="tablist"
        aria-label="Shop admin views"
      >
        <Button
          variant="text"
          role="tab"
          aria-selected={tab === 'products'}
          data-testid="tab-products"
          onClick={() => setTab('products')}
        >
          Products ({products.items.length})
        </Button>
        <Button
          variant="text"
          role="tab"
          aria-selected={tab === 'orders'}
          data-testid="tab-orders"
          onClick={() => setTab('orders')}
        >
          Orders ({orders.items.length})
        </Button>
      </div>

      {tab === 'products' && (
        <ProductsTab
          items={products.items}
          reload={products.reload}
        />
      )}
      {tab === 'orders' && (
        <OrdersTab items={orders.items} />
      )}
    </main>
  )
}
