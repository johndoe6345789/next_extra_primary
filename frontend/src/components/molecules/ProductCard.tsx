'use client';

/**
 * Product grid tile with image, name, price,
 * and an add-to-cart button.
 * @module components/molecules/ProductCard
 */
import React from 'react';
import Image from 'next/image';
import { Card } from '@shared/m3/surfaces/Card';
import { CardContent } from
  '@shared/m3/surfaces/CardContent';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/types/shop';

/** Props for ProductCard. */
export interface ProductCardProps {
  /** Product data to display. */
  product: Product;
  /** Called when user clicks "Add to cart". */
  onAddToCart: (productId: string) => void;
  /** data-testid override. */
  testId?: string;
}

/**
 * Displays a product tile in the shop grid.
 *
 * @param props - Component props.
 */
export const ProductCard: React.FC<
  ProductCardProps
> = ({
  product,
  onAddToCart,
  testId = 'product-card',
}) => (
  <Card
    data-testid={testId}
    aria-label={product.name}
  >
    {/* Image + text are a single link to the detail
        page; the Add-to-cart button is a sibling so its
        click is not swallowed by the link. */}
    <Link
      href={`/shop/${product.slug}`}
      style={{
        textDecoration: 'none', color: 'inherit',
        display: 'block',
      }}
      data-testid={`${testId}-link`}
    >
      <div style={{
        position: 'relative', height: 180,
      }}>
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 600px) 100vw, 300px"
        />
      </div>
      <CardContent sx={{
        padding: '16px 18px 8px 18px',
      }}>
        <Typography variant="subtitle1"
          sx={{ fontWeight: 600,
            lineHeight: 1.3 }}>
          {product.name}
        </Typography>
        <Typography variant="body2"
          sx={{ color: 'primary.main',
            fontWeight: 600,
            marginTop: '6px' }}>
          {product.price_display}
        </Typography>
      </CardContent>
    </Link>
    <CardContent sx={{
      padding: '0 18px 18px 18px',
    }}>
      <Button
        variant="filled"
        onClick={() => onAddToCart(product.id)}
        data-testid={`${testId}-add`}
        aria-label={`Add ${product.name} to cart`}
        sx={{ padding: '8px 18px',
          fontSize: '0.85rem' }}
      >
        Add to cart
      </Button>
    </CardContent>
  </Card>
);

export default ProductCard;
