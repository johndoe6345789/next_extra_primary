'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Chip from '@shared/m3/Chip';

/** Props for UserProfileInfo. */
export interface UserProfileInfoProps {
  /** Resolved display name (never empty). */
  name: string;
  /** Username, if available. */
  username?: string;
  /** User email address. */
  email?: string;
  /** User role label. */
  role?: string;
}

/**
 * Text block showing name, @username, email,
 * and role badge. Used inside UserProfileCard.
 */
export const UserProfileInfo: React.FC<
  UserProfileInfoProps
> = ({ name, username, email, role }) => {
  const roleColor =
    role === 'admin' ? 'error' : 'default';
  return (
    <Box style={{ minWidth: 0 }}>
      <Typography
        variant="subtitle1"
        style={{ fontWeight: 600 }}
        data-testid="profile-card-name"
      >
        {name}
      </Typography>
      {username && (
        <Typography
          variant="body2"
          style={{
            color:
              'var(--mat-sys-on-surface-variant)',
          }}
          data-testid="profile-card-username"
        >
          @{username}
        </Typography>
      )}
      {email && (
        <Typography
          variant="caption"
          style={{
            color:
              'var(--mat-sys-on-surface-variant)',
          }}
          data-testid="profile-card-email"
        >
          {email}
        </Typography>
      )}
      {role && (
        <Box style={{ marginTop: '4px' }}>
          <Chip
            label={role}
            color={roleColor}
            size="small"
            data-testid="profile-card-role"
          />
        </Box>
      )}
    </Box>
  );
};

export default UserProfileInfo;
