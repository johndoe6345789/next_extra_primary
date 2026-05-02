'use client';

/**
 * Inline form: write or edit a product review.
 * @module components/molecules/WriteReviewForm
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3/Box';
import { Typography } from '@shared/m3/Typography';
import { Button } from '@shared/m3/Button';
import { TextField } from '@shared/m3/TextField';
import { Rating } from '@shared/m3';
import { useWriteReviewForm }
  from '@/hooks/useWriteReviewForm';
import type { Review } from '@/types/shop';

/** Props for WriteReviewForm. */
export interface WriteReviewFormProps {
  /** Slug used to POST a new review. */
  productKey: string;
  /** User's existing review or null. */
  ownReview: Review | null;
}
/** Write / edit / delete a product review. */
export const WriteReviewForm: React.FC<
  WriteReviewFormProps
> = ({ productKey, ownReview }) => {
  const t = useTranslations('shop');
  const {
    rating, setRating, body, setBody,
    isLoading, successMsg, errorMsg,
    handleSubmit, handleDelete, isEditing,
  } = useWriteReviewForm(productKey, ownReview);

  return (
    <Box data-testid="write-review-form"
      sx={{ mt: 3, mb: 1 }}
      aria-label={t('reviews.writeYours')}>
      <Typography variant="subtitle1"
        fontWeight={600} sx={{ mb: 1 }}>
        {isEditing
          ? t('reviews.edit')
          : t('reviews.writeYours')}
      </Typography>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption"
          color="text.secondary">
          {t('reviews.rating')}
        </Typography>
        <Rating value={rating}
          onChange={(_, v) => setRating(v)}
          max={5} size="large" name="review-rating"
          testId="review-rating"
          aria-label={t('reviews.rating')} />
      </Box>
      <TextField label={t('reviews.body')}
        value={body}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement>,
        ) => setBody(e.target.value)}
        fullWidth multiline rows={3} size="small"
        sx={{ mb: 1.5 }} data-testid="review-body"
        aria-label={t('reviews.body')} />
      {successMsg && (
        <Typography variant="body2"
          color="success.main" sx={{ mb: 1 }}
          data-testid="review-success">
          {t(`reviews.${successMsg}` as
            'reviews.saved' | 'reviews.deleted')}
        </Typography>
      )}
      {errorMsg && (
        <Typography variant="body2"
          color="error.main" sx={{ mb: 1 }}
          data-testid="review-error">
          {t('reviews.errorBody')}
        </Typography>
      )}
      <Box sx={{ display: 'inline-flex',
        gap: '8px', alignItems: 'center' }}>
        <Button variant="filled"
          disabled={isLoading || rating < 1}
          onClick={handleSubmit}
          aria-label={t('reviews.submit')}
          data-testid="review-submit"
          sx={{ px: 3 }}>
          {t('reviews.submit')}
        </Button>
        {isEditing && (
          <Button variant="outlined"
            disabled={isLoading}
            onClick={handleDelete}
            aria-label={t('reviews.delete')}
            data-testid="review-delete">
            {t('reviews.delete')}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default WriteReviewForm;
