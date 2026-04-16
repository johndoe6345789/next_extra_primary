'use client';
/**
 * Single line item row inside the CartDrawer.
 * @module components/organisms/CartDrawerItem
 */
import React from 'react';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import type { CartItem } from '@/types/shop';

/** Props for CartDrawerItem. */
export interface CartDrawerItemProps {
  /** Cart line item to display. */
  item: CartItem;
  /** Update quantity callback. */
  onUpdate: (id: string, qty: number) => void;
  /** Remove callback. */
  onRemove: (id: string) => void;
  /** data-testid prefix. */
  testId?: string;
}

/**
 * Renders a cart item with quantity stepper.
 *
 * @param props - Component props.
 */
export const CartDrawerItem: React.FC<
  CartDrawerItemProps
> = ({ item, onUpdate, onRemove, testId = 'cart-item' }) => (
  <Box
    data-testid={testId}
    aria-label={item.product.name}
    sx={{
      display: 'flex', flexDirection: 'column',
      gap: 0.5, py: 1,
      borderBottom: '1px solid', borderColor: 'divider',
    }}
  >
    <Typography variant="body2">
      {item.product.name}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {item.product.price_display}
    </Typography>
    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
      <Button
        variant="outlined" size="small"
        onClick={() => onUpdate(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
        aria-label="Decrease quantity"
        data-testid={`${testId}-dec`}
      >−</Button>
      <Typography
        variant="body2" sx={{ lineHeight: '30px' }}
        aria-label={`Quantity: ${item.quantity}`}
      >
        {item.quantity}
      </Typography>
      <Button
        variant="outlined" size="small"
        onClick={() => onUpdate(item.id, item.quantity + 1)}
        aria-label="Increase quantity"
        data-testid={`${testId}-inc`}
      >+</Button>
      <Button
        variant="text" size="small"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
        data-testid={`${testId}-remove`}
      >Remove</Button>
    </Box>
  </Box>
);

export default CartDrawerItem;
