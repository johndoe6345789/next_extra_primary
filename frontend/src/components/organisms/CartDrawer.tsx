'use client';
/**
 * Right-side cart drawer.
 * @module components/organisms/CartDrawer
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from '@shared/m3/surfaces/Drawer';
import { Typography } from '@shared/m3/Typography';
import { Box } from '@shared/m3/Box';
import type { RootState } from '@/store/store';
import { closeCart } from '@/store/slices/cartSlice';
import { useCart } from '@/hooks/useCart';
import { useCheckout } from '@/hooks/useCheckout';
import { useScrollLock } from '@/hooks/useScrollLock';
import { CartDrawerItem } from './CartDrawerItem';
import { CartDrawerFooter } from './CartDrawerFooter';
import css from './CartDrawer.module.scss';

/** Props for CartDrawer. */
export interface CartDrawerProps {
  /** data-testid override. */
  testId?: string;
}

/**
 * Shopping cart right-side drawer.
 * Uses useScrollLock to prevent body scroll.
 *
 * @param props - Component props.
 */
export const CartDrawer: React.FC<CartDrawerProps> = (
  { testId = 'cart-drawer' },
) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (st: RootState) => st.cart.isOpen,
  );
  const { items, updateItem, removeItem } = useCart();
  const { startCheckout, isLoading } = useCheckout();
  useScrollLock(isOpen);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price_cents * i.quantity,
    0,
  );
  return (
    <Drawer
      open={isOpen} anchor="right" variant="temporary"
      onClose={() => dispatch(closeCart())}
      testId={testId}
    >
      <div
        className={css.drawer}
        aria-label="Shopping cart" role="dialog"
      >
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6">Your Cart</Typography>
        </Box>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Your cart is empty.
          </Typography>
        ) : (
          <div className={css.items}>
            {items.map((item) => (
              <CartDrawerItem
                key={item.id} item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
                testId={`cart-item-${item.id}`}
              />
            ))}
          </div>
        )}
        <CartDrawerFooter
          subtotalCents={subtotal}
          isCheckingOut={isLoading}
          onCheckout={startCheckout}
        />
      </div>
    </Drawer>
  );
};

export default CartDrawer;
