'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import { useTranslations } from 'next-intl';
import { Avatar } from '../atoms';
import { UserProfileInfo }
  from './UserProfileInfo';
import { resolveAvatar }
  from '../organisms/avatarMenuStyles';
import type { User } from '@/types/auth';

/** Props for UserProfileCard. */
export interface UserProfileCardProps {
  /** Authenticated user object. */
  user: User;
}

/**
 * Displays user avatar and profile info
 * in a compact card layout.
 */
export const UserProfileCard: React.FC<
  UserProfileCardProps
> = ({ user }) => {
  const t = useTranslations('nav');
  const { name, src } = resolveAvatar(
    user.displayName, user.username,
    user.avatarUrl, t('guest'),
  );
  return (
    <Box
      data-testid="user-profile-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
      }}
    >
      <Avatar
        alt={name}
        src={src}
        fallbackText={name[0]}
        size="lg"
        testId="profile-card-avatar"
      />
      <UserProfileInfo
        name={name}
        username={user.username}
        email={user.email}
        role={user.role}
      />
    </Box>
  );
};

export default UserProfileCard;
