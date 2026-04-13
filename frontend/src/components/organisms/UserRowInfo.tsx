'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';

/** Props for UserRowInfo. */
interface UserRowInfoProps {
  /** Display username. */
  username: string;
  /** User email address. */
  email: string;
}

/** User name and email display. */
const UserRowInfo: React.FC<
  UserRowInfoProps
> = ({ username, email }) => (
  <div style={{
    flex: 1, minWidth: 0, overflow: 'hidden',
  }}>
    <Typography variant="body2"
      style={{
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
      {username}
    </Typography>
    <Typography variant="caption"
      color="text.secondary"
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'block',
      }}>
      {email}
    </Typography>
  </div>
);

export default UserRowInfo;
