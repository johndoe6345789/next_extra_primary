'use client';
/**
 * Order detail page with line items.
 * @module app/[locale]/(dashboard)/profile/orders/[id]/page
 */
import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { useGetOrderQuery } from
  '@/store/api/shopOrdersApi';

/**
 * Renders a single order's details and line items.
 *
 * @returns Order detail page.
 */
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations('shop');
  const { data: order, isLoading } =
    useGetOrderQuery(id ?? '');
  if (isLoading || !order) {
    return (
      <Typography
        color="text.secondary"
        data-testid="order-detail-loading"
      >{t('loading')}</Typography>
    );
  }
  return (
    <Box
      aria-label={`Order ${order.id}`}
      data-testid="order-detail"
      sx={{ maxWidth: 600, mx: 'auto' }}
    >
      <Typography variant="h4" gutterBottom>
        {t('orderDetail')}
      </Typography>
      <Typography
        variant="caption" color="text.secondary"
        sx={{ display: 'block', mb: 1 }}
      >{order.created_at}</Typography>
      <Typography
        variant="body2"
        sx={{
          px: 1, py: 0.25, borderRadius: 1,
          bgcolor: 'action.selected',
          display: 'inline-block', mb: 2,
        }}
        aria-label={`Status: ${order.status}`}
      >{order.status}</Typography>
      {(order.items ?? []).map((item) => (
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
            {`$${(item.unit_price_cents / 100).toFixed(2)}`}
          </Typography>
        </Box>
      ))}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between', pt: 2,
      }}>
        <Typography variant="subtitle1">
          {t('total')}
        </Typography>
        <Typography variant="subtitle1">
          {order.total_display}
        </Typography>
      </Box>
    </Box>
  );
}
