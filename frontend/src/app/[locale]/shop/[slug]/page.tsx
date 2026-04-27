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

/**
 * Renders a single product's detail view.
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
      <Typography
        color="text.secondary"
        data-testid="product-detail-loading"
      >{t('loading')}</Typography>
    );
  }
  return (
    <Box
      aria-label={product.name}
      data-testid="product-detail"
      sx={{ maxWidth: 700, mx: 'auto' }}
    >
      <Box sx={{ position: 'relative', height: 320, mb: 3 }}>
        <Image
          src={product.image_url} alt={product.name}
          fill style={{ objectFit: 'cover', borderRadius: 8 }}
          sizes="700px"
        />
      </Box>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="h5" color="primary" gutterBottom>
        {product.price_display}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {product.description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined" size="small"
          onClick={() => setQty(Math.max(1, qty - 1))}
          disabled={qty <= 1}
          aria-label={t('decreaseQty')}
          data-testid="detail-dec"
        >−</Button>
        <Typography sx={{ lineHeight: '36px' }}>
          {qty}
        </Typography>
        <Button
          variant="outlined" size="small"
          onClick={() => setQty(qty + 1)}
          disabled={qty >= product.stock}
          aria-label={t('increaseQty')}
          data-testid="detail-inc"
        >+</Button>
      </Box>
      <Button
        variant="filled"
        onClick={() => addItem(product.id, qty)}
        aria-label={t('addToCart')}
        data-testid="detail-add-to-cart"
      >{t('addToCart')}</Button>
    </Box>
  );
}
