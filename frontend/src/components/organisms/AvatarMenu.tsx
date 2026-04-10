'use client';

import React, { useState } from 'react';
import Menu from '@shared/m3/Menu';
import MenuItem from '@shared/m3/MenuItem';
import Divider from '@shared/m3/Divider';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useGetUserStatsQuery }
  from '@/store/api/userApi';
import { useAvatarPick }
  from '@/hooks/useAvatarPick';
import { Avatar } from '../atoms';
import { UserProfileCard }
  from '../molecules/UserProfileCard';
import { UserQuickStats }
  from '../molecules/UserQuickStats';
import { AvatarPicker }
  from '../molecules/AvatarPicker';
import {
  menuStyle, linkStyle, menuLinks,
  resolveAvatar,
} from './avatarMenuStyles';
import type { User } from '@/types/auth';

/** Props for AvatarMenu. */
export interface AvatarMenuProps {
  /** Current user. */
  user: User | null;
  /** Logout handler. */
  onLogout: () => void;
}

/**
 * Avatar with dropdown showing profile card,
 * avatar picker, quick stats, and nav items.
 */
export const AvatarMenu: React.FC<
  AvatarMenuProps
> = ({ user, onLogout }) => {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const [el, setEl] =
    useState<null | HTMLElement>(null);
  const close = () => setEl(null);
  const { data: stats } = useGetUserStatsQuery(
    user?.id ?? '', { skip: !user?.id },
  );
  const pick = useAvatarPick(user);
  const { name, src } = resolveAvatar(
    user?.displayName, user?.username,
    user?.avatarUrl, t('guest'),
  );

  return (
    <>
      <Avatar
        alt={name}
        src={src}
        fallbackText={name[0]}
        size="sm"
        onClick={(e) => setEl(e.currentTarget)}
        testId="navbar-avatar"
      />
      <Menu
        anchorEl={el} open={!!el}
        onClose={close} anchorRight
        style={menuStyle}
        data-testid="navbar-avatar-menu"
      >
        {user && <UserProfileCard user={user} />}
        <Divider />
        <AvatarPicker
          current={user?.avatarUrl}
          onPick={pick}
        />
        <Divider />
        <UserQuickStats stats={stats} />
        <Divider />
        {menuLinks.map((l) => (
          <Link key={l.key} href={l.href}
            style={linkStyle}>
            <MenuItem onClick={close}>
              {t(l.key)}
            </MenuItem>
          </Link>
        ))}
        <MenuItem
          onClick={() => { close(); onLogout(); }}
        >
          {tAuth('logout')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;