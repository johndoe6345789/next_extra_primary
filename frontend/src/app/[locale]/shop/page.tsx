'use client';
/**
 * Shop product listing page.
 * @module app/[locale]/(dashboard)/shop/page
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import { useShopProducts } from '@/hooks/useShopProducts';
import { useCart } from '@/hooks/useCart';
import { ProductCard } from
  '@/components/molecules/ProductCard';
import { PolishPanel } from
  '@/components/molecules/PolishPanel';
import { EditorialHeader } from
  '@/components/molecules/EditorialHeader';

/**
 * Paginated product grid for the shop.
 *
 * @returns Shop listing page.
 */
export default function ShopPage() {
  const t = useTranslations('shop');
  const { products, total, page, setPage, isLoading } =
    useShopProducts(12);
  const { addItem } = useCart();
  const totalPages = Math.ceil(total / 12);
  const itemsLabel = total > 0
    ? `${total} ${t('items') ?? 'items'}` : '';
  return (
    <Box
      aria-label={t('title')}
      data-testid="shop-page"
      sx={{ width: '100%', maxWidth: '1280px',
        marginLeft: 'auto', marginRight: 'auto' }}
    >
      <PolishPanel ariaLabel={t('title')}>
        <EditorialHeader
          eyebrow={itemsLabel}
          title={t('title')}
        />
        {isLoading ? (
          <Typography color="text.secondary"
            sx={{ textAlign: 'center' }}>
            {t('loading')}
          </Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {products.map((p) => (
              <ProductCard
                key={p.id} product={p}
                onAddToCart={(id) => addItem(id, 1)}
                testId={`product-${p.id}`}
              />
            ))}
          </Box>
        )}
        <Box sx={{
          display: 'flex', gap: 1,
          marginTop: '32px',
          justifyContent: 'center',
        }}>
          <Button variant="outlined" size="small"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            aria-label={t('prevPage')}
            data-testid="shop-prev"
          >{t('prev')}</Button>
          <Typography sx={{ lineHeight: '32px' }}>
            {t('pageOf', { page, total: totalPages })}
          </Typography>
          <Button variant="outlined" size="small"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            aria-label={t('nextPage')}
            data-testid="shop-next"
          >{t('next')}</Button>
        </Box>
      </PolishPanel>
    </Box>
  );
}
