'use client';
/**
 * Order history page with status badges.
 * @module app/[locale]/(dashboard)/profile/orders/page
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import { useGetOrdersQuery } from
  '@/store/api/shopOrdersApi';

/**
 * Lists the current user's order history.
 *
 * @returns Orders list page.
 */
export default function OrdersPage() {
  const t = useTranslations('shop');
  const { data: orders = [], isLoading } =
    useGetOrdersQuery();
  if (isLoading) {
    return (
      <Typography color="text.secondary">
        {t('loading')}
      </Typography>
    );
  }
  return (
    <Box aria-label={t('orders')} data-testid="orders-page">
      <Typography variant="h4" gutterBottom>
        {t('orders')}
      </Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary">
          {t('noOrders')}
        </Typography>
      ) : orders.map((order) => (
        <Box
          key={order.id}
          data-testid={`order-${order.id}`}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="body2">
              {order.id}
            </Typography>
            <Typography
              variant="caption" color="text.secondary"
            >{order.created_at}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: 'action.selected' }}
              aria-label={`Status: ${order.status}`}
            >{order.status}</Typography>
            <Typography variant="body2">
              {order.total_display}
            </Typography>
            <Button
              variant="text" size="small"
              component={Link}
              href={`/profile/orders/${order.id}`}
              aria-label={`View order ${order.id}`}
              data-testid={`order-view-${order.id}`}
            >{t('viewOrder')}</Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
