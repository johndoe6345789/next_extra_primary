'use client';

import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { Avatar } from '../atoms';
import type { User } from '@/types/auth';

/** Props for AvatarMenu. */
export interface AvatarMenuProps {
  /** Current user. */
  user: User | null;
  /** Logout handler. */
  onLogout: () => void;
}

/**
 * Avatar with dropdown: Profile, Settings,
 * Logout menu items.
 *
 * @param props - Component props.
 */
export const AvatarMenu: React.FC<
  AvatarMenuProps
> = ({ user, onLogout }) => {
  const [el, setEl] =
    useState<null | HTMLElement>(null);
  const close = () => setEl(null);
  return (
    <>
      <Avatar
        alt={user?.displayName ?? 'User'}
        src={user?.avatarUrl} size="sm"
        onClick={(e) => setEl(e.currentTarget)}
        testId="navbar-avatar"
      />
      <Menu
        anchorEl={el} open={!!el}
        onClose={close}
        data-testid="navbar-avatar-menu"
      >
        <MenuItem
          component={Link} href="/profile"
          onClick={close}
        >
          Profile
        </MenuItem>
        <MenuItem
          component={Link} href="/settings"
          onClick={close}
        >
          Settings
        </MenuItem>
        <MenuItem onClick={() => {
          close(); onLogout();
        }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
