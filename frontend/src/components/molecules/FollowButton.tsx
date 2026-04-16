'use client';

import React from 'react';
import { Button } from '@shared/m3/Button';
import { useTranslations } from 'next-intl';
import { useFollow } from '@/hooks/useFollow';

/** Props for the FollowButton component. */
export interface FollowButtonProps {
  /** User ID to follow / unfollow. */
  userId: string;
  /** Whether the current user already follows. */
  initialFollowing?: boolean;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Follow / Unfollow toggle button with optimistic
 * update. Disables while the mutation is in flight.
 *
 * @param props - Component props.
 */
export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing = false,
  testId = 'follow-button',
}) => {
  const t = useTranslations('social');
  const { isFollowing, toggle, isLoading } = useFollow(
    userId,
    initialFollowing,
  );

  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      onClick={toggle}
      disabled={isLoading}
      aria-label={
        isFollowing ? t('unfollow') : t('follow')
      }
      aria-pressed={isFollowing}
      testId={testId}
    >
      {isFollowing ? t('unfollow') : t('follow')}
    </Button>
  );
};

export default FollowButton;
