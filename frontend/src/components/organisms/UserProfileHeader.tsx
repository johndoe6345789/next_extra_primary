'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Avatar } from '../atoms';
import { PresenceDot } from '../molecules/PresenceDot';
import { FollowButton } from '../molecules/FollowButton';
import { useTranslations } from 'next-intl';
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
} from '@/store/api/socialFollowsApi';
import { useAuth } from '@/hooks';

/** Props for UserProfileHeader. */
export interface UserProfileHeaderProps {
  /** User's ID. */
  userId: string;
  /** Display name. */
  displayName: string;
  /** @handle. */
  handle: string;
  /** Avatar URL. */
  avatarUrl?: string;
  /** Bio text. */
  bio?: string;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Profile header: avatar, name, presence dot, bio,
 * follower/following counts, and follow button.
 *
 * @param props - Component props.
 */
export const UserProfileHeader: React.FC<
  UserProfileHeaderProps
> = ({ userId, displayName, handle, avatarUrl, bio,
  testId = 'user-profile-header' }) => {
  const t = useTranslations('social');
  const { user } = useAuth();
  const { data: frs } = useGetFollowersQuery(userId);
  const { data: fng } = useGetFollowingQuery(userId);
  const isSelf = user?.id === userId;

  return (
    <Box
      data-testid={testId}
      aria-label={t('profileOf', { name: displayName })}
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 2, pb: 3 }}
    >
      <Box sx={{ display: 'flex', gap: 2,
        alignItems: 'flex-start' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarUrl} alt={displayName}
            size="lg" testId={`${testId}-avatar`}
          />
          <Box sx={{ position: 'absolute',
            bottom: 2, right: 2 }}>
            <PresenceDot userId={userId} />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {displayName}
          </Typography>
          <Typography variant="body2"
            color="text.secondary">
            @{handle}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Typography variant="body2">
              <strong>{frs?.count ?? 0}</strong>{' '}
              {t('followers')}
            </Typography>
            <Typography variant="body2">
              <strong>{fng?.count ?? 0}</strong>{' '}
              {t('following')}
            </Typography>
          </Box>
        </Box>
        {!isSelf && (
          <FollowButton
            userId={userId}
            initialFollowing={frs?.isFollowing}
            testId={`${testId}-follow`}
          />
        )}
      </Box>
      {bio && (
        <Typography variant="body1">{bio}</Typography>
      )}
    </Box>
  );
};

export default UserProfileHeader;
