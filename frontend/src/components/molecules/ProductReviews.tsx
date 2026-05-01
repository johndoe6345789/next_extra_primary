'use client';

/**
 * Product reviews list. Renders star rating, author,
 * relative date, and review body. Fetches via RTK
 * Query keyed on the product slug.
 *
 * @module components/molecules/ProductReviews
 */
import React from 'react';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import {
  useGetProductReviewsQuery,
} from '@/store/api/shopProductsApi';
import type { Review } from '@/types/shop';

/** Props for ProductReviews. */
export interface ProductReviewsProps {
  /** Product slug for which to fetch reviews. */
  slug: string;
}

/** Render one star row given a 1–5 rating. */
function Stars({ rating }: { rating: number }):
  React.ReactElement {
  return (
    <span aria-label={`${rating} out of 5 stars`}
      style={{
        color: '#f5b921', letterSpacing: '0.1em',
      }}>
      {'★★★★★'.slice(0, rating)}
      <span style={{ color: '#5b5b5b' }}>
        {'★★★★★'.slice(rating)}
      </span>
    </span>
  );
}

/**
 * Reviews section for a product detail page.
 *
 * @param props - Component props.
 */
export const ProductReviews: React.FC<
  ProductReviewsProps
> = ({ slug }) => {
  const { data, isLoading } =
    useGetProductReviewsQuery(slug);
  if (isLoading) return null;
  const reviews: Review[] = data?.items ?? [];
  return (
    <Box
      data-testid="product-reviews"
      sx={{ mt: 4 }}
    >
      <Typography variant="h6"
        sx={{ marginBottom: '16px' }}
      >
        Reviews ({reviews.length})
      </Typography>
      {reviews.length === 0 && (
        <Typography color="text.secondary"
          variant="body2">
          No reviews yet.
        </Typography>
      )}
      {reviews.map((r) => (
        <Box key={r.id}
          data-testid={`review-${r.id}`}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            paddingTop: '12px',
            paddingBottom: '12px',
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}>
            <Typography variant="subtitle2">
              {r.author}
            </Typography>
            <Stars rating={r.rating} />
          </Box>
          <Typography variant="body2"
            color="text.secondary"
            sx={{ marginTop: '6px' }}>
            {r.body}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ProductReviews;
