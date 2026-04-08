'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import { Select, MenuItem } from '@shared/m3';
import type { SelectChangeEvent } from
  '@shared/m3';
import { Button, Chip } from '../atoms';
import type { UserRowProps } from
  './userRowTypes';
import { rowStyle } from './userRowTypes';

export type {
  UserRecord, UserRowProps,
} from './userRowTypes';

/** Single user row in the admin list. */
const UserRow: React.FC<UserRowProps> = ({
  user, onRoleChange,
  onToggleActive, t,
}) => (
  <div
    style={rowStyle}
    data-testid={`user-row-${user.id}`}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2"
        style={{ fontWeight: 600 }}>
        {user.username}
      </Typography>
      <Typography variant="caption"
        color="text.secondary">
        {user.email}
      </Typography>
    </div>
    <Chip
      label={user.isActive
        ? t('active') : t('disabled')}
      testId={`status-${user.id}`}
    />
    <Select
      value={user.role}
      onChange={(
        e: SelectChangeEvent<
          string | string[]>,
      ) => onRoleChange(
        e.target.value as string,
      )}
      size="small"
      testId={`role-${user.id}`}
    >
      <MenuItem value="user">User</MenuItem>
      <MenuItem value="moderator">
        Mod
      </MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
    </Select>
    <Button
      onClick={onToggleActive}
      testId={`toggle-${user.id}`}
      ariaLabel={user.isActive
        ? t('disable') : t('enable')}>
      {user.isActive
        ? t('disable') : t('enable')}
    </Button>
  </div>
);

export default UserRow;
