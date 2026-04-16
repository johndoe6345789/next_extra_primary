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
    <div style={{ position: 'relative', height: 180 }}>
      <Image
        src={product.image_url}
        alt={product.name}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 600px) 100vw, 300px"
      />
    </div>
    <CardContent>
      <Typography variant="subtitle1">
        {product.name}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5 }}
      >
        {product.price_display}
      </Typography>
      <Button
        variant="filled"
        size="small"
        onClick={() => onAddToCart(product.id)}
        data-testid={`${testId}-add`}
        aria-label={`Add ${product.name} to cart`}
        sx={{ mt: 1 }}
      >
        Add to cart
      </Button>
    </CardContent>
  </Card>
);

export default ProductCard;
