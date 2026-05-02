'use client';

/**
 * Star rating display helper for ProductReviews.
 * @module components/molecules/reviewStars
 */
import React from 'react';

/** Props for Stars. */
interface StarsProps {
  /** Numeric rating 1–5. */
  rating: number;
}

/**
 * Renders filled + hollow star characters for a
 * 1–5 rating.
 *
 * @param props - Component props.
 */
export function Stars(
  { rating }: StarsProps,
): React.ReactElement {
  return (
    <span
      aria-label={`${rating} out of 5 stars`}
      style={{ color: '#f5b921',
        letterSpacing: '0.1em' }}
    >
      {'★★★★★'.slice(0, rating)}
      <span style={{ color: '#5b5b5b' }}>
        {'★★★★★'.slice(rating)}
      </span>
    </span>
  );
}
