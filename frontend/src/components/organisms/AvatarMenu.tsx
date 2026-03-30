'use client';

import React, { useState } from 'react';
import Menu from '@metabuilder/m3/Menu';
import MenuItem from '@metabuilder/m3/MenuItem';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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
export const AvatarMenu: React.FC<AvatarMenuProps> = ({
  user,
  onLogout,
}) => {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const [el, setEl] = useState<null | HTMLElement>(null);
  const close = () => setEl(null);
  return (
    <>
      <Avatar
        alt={user?.displayName ?? 'User'}
        src={user?.avatarUrl}
        size="sm"
        onClick={(e) => setEl(e.currentTarget)}
        testId="navbar-avatar"
      />
      <Menu
        anchorEl={el}
        open={!!el}
        onClose={close}
        data-testid="navbar-avatar-menu"
      >
        <MenuItem
          component={Link}
          href="/profile"
          onClick={close}
        >
          {t('profile')}
        </MenuItem>
        <MenuItem
          component={Link}
          href="/settings"
          onClick={close}
        >
          {t('settings')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            close();
            onLogout();
          }}
        >
          {tAuth('logout')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
