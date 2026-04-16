'use client';

/**
 * Checkout page: cart summary + Stripe redirect.
 * @module app/[locale]/(dashboard)/shop/checkout/page
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import { useCart } from '@/hooks/useCart';
import { useCheckout } from '@/hooks/useCheckout';

/**
 * Displays cart summary and initiates checkout.
 *
 * @returns Checkout page UI.
 */
export default function CheckoutPage() {
  const t = useTranslations('shop');
  const { items } = useCart();
  const { startCheckout, isLoading } =
    useCheckout();

  const subtotal = items.reduce(
    (sum, i) =>
      sum + i.product.price_cents * i.quantity,
    0,
  );
  const formatted =
    `$${(subtotal / 100).toFixed(2)}`;

  return (
    <Box
      aria-label={t('checkout')}
      data-testid="checkout-page"
      sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        {t('checkout')}
      </Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">
          {t('emptyCart')}
        </Typography>
      ) : (
        <>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2">
                {item.product.name} ×{item.quantity}
              </Typography>
              <Typography variant="body2">
                {item.product.price_display}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: 2, mb: 3,
            }}
          >
            <Typography variant="subtitle1">
              {t('subtotal')}
            </Typography>
            <Typography variant="subtitle1">
              {formatted}
            </Typography>
          </Box>
          <Button
            variant="filled"
            fullWidth
            onClick={startCheckout}
            disabled={isLoading}
            aria-label={t('payWithStripe')}
            data-testid="checkout-pay"
          >
            {isLoading
              ? t('redirecting')
              : t('payWithStripe')}
          </Button>
        </>
      )}
    </Box>
  );
}
