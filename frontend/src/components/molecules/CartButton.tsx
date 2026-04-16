'use client';

/**
 * Cart icon button with item-count badge.
 * Dispatches openCart() to show the CartDrawer.
 * @module components/molecules/CartButton
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { ShoppingCart as ShoppingCartIcon }
  from '@shared/icons/ShoppingCart';
import { IconButton } from '../atoms/IconButton';
import NotificationBadge from
  './NotificationBadge';
import { openCart } from
  '@/store/slices/cartSlice';
import { useCart } from '@/hooks/useCart';
import { t as tk } from '@shared/theme/tokens';

/** Props for CartButton. */
export interface CartButtonProps {
  /** data-testid override. */
  testId?: string;
}

/**
 * Shopping cart icon button.
 * Shows a badge with the current item count.
 *
 * @param props - Component props.
 */
export const CartButton: React.FC<
  CartButtonProps
> = ({ testId = 'cart-button' }) => {
  const dispatch = useDispatch();
  const { itemCount } = useCart();

  const label =
    itemCount > 0
      ? `Cart — ${itemCount} item${itemCount > 1 ? 's' : ''}`
      : 'Cart — empty';

  const btn = (
    <IconButton
      icon={
        <ShoppingCartIcon
          size={28}
          style={{ color: tk.onSurface }}
        />
      }
      ariaLabel={label}
      onClick={() => dispatch(openCart())}
      tooltip="Cart"
      testId={`${testId}-icon`}
    />
  );

  return (
    <span
      data-testid={testId}
      style={{
        position: 'relative',
        display: 'inline-flex',
      }}
    >
      {btn}
      {itemCount > 0 && (
        <NotificationBadge
          count={itemCount}
          testId={testId}
        />
      )}
    </span>
  );
};

export default CartButton;
