'use client';

/**
 * Footer for CartDrawer showing subtotal and
 * the checkout CTA button.
 * @module components/organisms/CartDrawerFooter
 */
import React from 'react';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';

/** Props for CartDrawerFooter. */
export interface CartDrawerFooterProps {
  /** Subtotal in cents. */
  subtotalCents: number;
  /** Whether checkout is processing. */
  isCheckingOut: boolean;
  /** Checkout trigger. */
  onCheckout: () => void;
  /** data-testid prefix. */
  testId?: string;
}

/** Format cents as a dollars string. */
function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Displays subtotal and checkout button.
 *
 * @param props - Component props.
 */
export const CartDrawerFooter: React.FC<
  CartDrawerFooterProps
> = ({
  subtotalCents,
  isCheckingOut,
  onCheckout,
  testId = 'cart-footer',
}) => (
  <Box
    data-testid={testId}
    sx={{
      pt: 2,
      borderTop: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mb: 1.5,
      }}
    >
      <Typography variant="subtitle2">
        Subtotal
      </Typography>
      <Typography
        variant="subtitle2"
        aria-label={
          `Subtotal: ${formatCents(subtotalCents)}`
        }
      >
        {formatCents(subtotalCents)}
      </Typography>
    </Box>
    <Button
      variant="filled"
      fullWidth
      onClick={onCheckout}
      disabled={isCheckingOut || subtotalCents === 0}
      aria-label="Proceed to checkout"
      data-testid={`${testId}-checkout`}
    >
      {isCheckingOut ? 'Redirecting…' : 'Pay with Stripe'}
    </Button>
  </Box>
);

export default CartDrawerFooter;
