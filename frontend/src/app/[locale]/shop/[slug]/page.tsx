'use client';
/**
 * Product detail page.
 * @module app/[locale]/(dashboard)/shop/[slug]/page
 */
import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import { useGetProductQuery } from
  '@/store/api/shopProductsApi';
import { useCart } from '@/hooks/useCart';
import { ProductReviews } from
  '@/components/molecules/ProductReviews';
import { PolishPanel } from
  '@/components/molecules/PolishPanel';
import { PanelBackLink } from
  '@/components/molecules/PanelBackLink';
import { QtyStepper } from
  '@/components/molecules/QtyStepper';

/**
 * Product detail in the standard cool-cat panel.
 *
 * @returns Product detail page.
 */
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations('shop');
  const { data: product, isLoading } =
    useGetProductQuery(slug ?? '');
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  if (isLoading || !product) {
    return (
      <Typography color="text.secondary"
        data-testid="product-detail-loading">
        {t('loading')}
      </Typography>
    );
  }
  return (
    <Box aria-label={product.name}
      data-testid="product-detail"
      sx={{ width: '100%', maxWidth: '820px',
        marginLeft: 'auto', marginRight: 'auto' }}>
      <PolishPanel size="comfy">
        <PanelBackLink href="/shop" label="← Shop" />
        <Box sx={{ position: 'relative',
          height: '320px',
          marginBottom: '28px',
          borderRadius: '12px',
          overflow: 'hidden' }}>
          <Image src={product.image_url}
            alt={product.name} fill
            style={{ objectFit: 'cover' }}
            sizes="820px" />
        </Box>
        <Typography variant="h4" fontWeight={700}
          sx={{ letterSpacing: '-0.02em',
            marginBottom: '8px' }}>
          {product.name}
        </Typography>
        <Typography variant="h5"
          sx={{ color: 'primary.main',
            fontWeight: 600, marginBottom: '16px' }}>
          {product.price_display}
        </Typography>
        <Typography variant="body1"
          sx={{ marginBottom: '24px',
            color: 'text.secondary', lineHeight: 1.7 }}>
          {product.description}
        </Typography>
        <Box sx={{ marginBottom: '20px' }}>
          <QtyStepper value={qty} max={product.stock}
            onChange={setQty}
            decreaseLabel={t('decreaseQty')}
            increaseLabel={t('increaseQty')}
            testId="detail" />
        </Box>
        <Button variant="filled"
          onClick={() => addItem(product.id, qty)}
          aria-label={t('addToCart')}
          data-testid="detail-add-to-cart"
          sx={{ padding: '10px 28px',
            fontSize: '0.95rem' }}
        >{t('addToCart')}</Button>
        <ProductReviews slug={product.slug} />
      </PolishPanel>
    </Box>
  );
}
