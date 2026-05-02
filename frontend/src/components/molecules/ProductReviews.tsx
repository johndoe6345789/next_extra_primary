'use client';

/**
 * Product reviews list + inline write form.
 * @module components/molecules/ProductReviews
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import {
  useGetProductReviewsQuery,
} from '@/store/api/shopProductsApi';
import { useAuth } from '@/hooks/useAuth';
import { WriteReviewForm }
  from '@/components/molecules/WriteReviewForm';
import { Stars }
  from '@/components/molecules/reviewStars';
import type { Review } from '@/types/shop';

/** Props for ProductReviews. */
export interface ProductReviewsProps {
  /** Product slug for which to fetch reviews. */
  slug: string;
}

/**
 * Reviews list + write form for a product page.
 * @param props - Component props.
 */
export const ProductReviews: React.FC<
  ProductReviewsProps
> = ({ slug }) => {
  const t = useTranslations('shop.reviews');
  const { data, isLoading } =
    useGetProductReviewsQuery(slug);
  const { user, isAuthenticated } = useAuth();

  if (isLoading) return null;
  const reviews: Review[] = data?.items ?? [];

  const ownReview = isAuthenticated && user
    ? (reviews.find(
        (r) => r.author === user.displayName ||
               r.author === user.username,
      ) ?? null)
    : null;

  return (
    <Box data-testid="product-reviews"
      sx={{ mt: 4 }}>
      <Typography variant="h6"
        sx={{ marginBottom: '16px' }}>
        {t('title')} ({reviews.length})
      </Typography>
      {reviews.length === 0 && (
        <Typography color="text.secondary"
          variant="body2">
          {t('title')}
        </Typography>
      )}
      {reviews.map((r) => (
        <Box key={r.id}
          data-testid={`review-${r.id}`}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: '12px', pb: '12px',
          }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', mb: '4px',
          }}>
            <Typography variant="subtitle2">
              {r.author}
            </Typography>
            <Stars rating={r.rating} />
          </Box>
          <Typography variant="body2"
            color="text.secondary"
            sx={{ mt: '6px' }}>
            {r.body}
          </Typography>
        </Box>
      ))}
      {isAuthenticated && (
        <WriteReviewForm
          productKey={slug}
          ownReview={ownReview} />
      )}
    </Box>
  );
};

export default ProductReviews;
