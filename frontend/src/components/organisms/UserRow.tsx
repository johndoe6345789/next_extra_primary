'use client';

import React from 'react';
import { Select, MenuItem } from '@shared/m3';
import type { SelectChangeEvent } from
  '@shared/m3';
import Button from '@shared/m3/Button';
import Chip from '@shared/m3/Chip';
import type { UserRowProps } from
  './userRowTypes';
import {
  rowStyle, selectStyle, buttonStyle,
} from './userRowTypes';
import UserRowInfo from './UserRowInfo';

export type {
  UserRecord, UserRowProps,
} from './userRowTypes';

/** Single user row in the admin list. */
const UserRow: React.FC<UserRowProps> = ({
  user, onRoleChange,
  onToggleActive, onImpersonate, t,
}) => (
  <div
    style={rowStyle}
    data-testid={`user-row-${user.id}`}
  >
    <UserRowInfo
      username={user.username}
      email={user.email}
    />
    <Chip
      label={user.isActive
        ? t('active') : t('disabled')}
      aria-label={user.isActive
        ? t('active') : t('disabled')}
      data-testid={`status-${user.id}`}
    />
    <div style={selectStyle}>
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
        fullWidth
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="moderator">
          Mod
        </MenuItem>
        <MenuItem value="admin">
          Admin
        </MenuItem>
      </Select>
    </div>
    <Button
      onClick={onToggleActive}
      data-testid={`toggle-${user.id}`}
      aria-label={user.isActive
        ? t('disable') : t('enable')}
      style={buttonStyle}>
      {user.isActive
        ? t('disable') : t('enable')}
    </Button>
    <Button
      onClick={onImpersonate}
      data-testid={`impersonate-${user.id}`}
      aria-label={t('impersonate')}
      style={buttonStyle}>
      {t('impersonate')}
    </Button>
  </div>
);

export default UserRow;
