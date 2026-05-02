'use client';

/**
 * State + submit logic for the write-review form.
 * Handles both create-new and edit-existing flows.
 * @module hooks/useWriteReviewForm
 */
import { useState, useEffect } from 'react';
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from '@/store/api/shopReviewsApi';
import type { Review } from '@/types/shop';

/** What the form hook exposes to its component. */
export interface WriteReviewFormState {
  rating: number;
  setRating: (v: number) => void;
  body: string;
  setBody: (v: string) => void;
  isLoading: boolean;
  successMsg: string | null;
  errorMsg: string | null;
  handleSubmit: () => Promise<void>;
  handleDelete: () => Promise<void>;
  isEditing: boolean;
}

/**
 * Drive the product-review write form.
 *
 * @param productKey - Slug or numeric id string.
 * @param ownReview  - User's existing review or null.
 * @returns Form state and handlers.
 */
export function useWriteReviewForm(
  productKey: string,
  ownReview: Review | null,
): WriteReviewFormState {
  const [rating, setRating] = useState(
    ownReview?.rating ?? 0,
  );
  const [body, setBody] = useState(
    ownReview?.body ?? '',
  );
  const [successMsg, setSuccessMsg] =
    useState<string | null>(null);
  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

  useEffect(() => {
    setRating(ownReview?.rating ?? 0);
    setBody(ownReview?.body ?? '');
  }, [ownReview]);

  const [create, { isLoading: creating }] =
    useCreateReviewMutation();
  const [update, { isLoading: updating }] =
    useUpdateReviewMutation();
  const [remove, { isLoading: deleting }] =
    useDeleteReviewMutation();

  const isLoading = creating || updating || deleting;

  const handleSubmit = async () => {
    setSuccessMsg(null); setErrorMsg(null);
    try {
      if (ownReview) {
        await update({
          id: ownReview.id, rating, body,
        }).unwrap();
      } else {
        await create({
          productKey, rating, body,
        }).unwrap();
      }
      setSuccessMsg('saved');
    } catch { setErrorMsg('error'); }
  };

  const handleDelete = async () => {
    if (!ownReview) return;
    setSuccessMsg(null); setErrorMsg(null);
    try {
      await remove(ownReview.id).unwrap();
      setSuccessMsg('deleted');
    } catch { setErrorMsg('error'); }
  };

  return {
    rating, setRating, body, setBody,
    isLoading, successMsg, errorMsg,
    handleSubmit, handleDelete,
    isEditing: ownReview !== null,
  };
}
