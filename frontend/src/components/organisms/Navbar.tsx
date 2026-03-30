'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { SkipLink } from '../molecules/SkipLink';
import { NavbarLogo } from '../molecules/NavbarLogo';
import { DesktopActions } from '../molecules/DesktopActions';
import { NotificationBell } from '../molecules/NotificationBell';
import { AvatarMenu } from './AvatarMenu';
import { MobileDrawer } from './MobileDrawer';
import { NavLinks } from './NavLinks';

/** Props for the Navbar organism. */
export interface NavbarProps {
  onNotificationClick?: () => void;
  onSearch?: (q: string) => void;
  testId?: string;
}

/**
 * Responsive app bar. Desktop: all controls visible.
 * Mobile: burger menu + bell + avatar only.
 *
 * @param props - Component props.
 */
export const Navbar: React.FC<NavbarProps> = ({
  onNotificationClick,
  onSearch,
  testId = 'navbar',
}) => {
  const { user, logout } = useAuth();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const LINKS = [
    { label: tNav('dashboard'), href: '/dashboard' },
    { label: tNav('leaderboard'), href: '/leaderboard' },
    { label: tNav('chat'), href: '/chat' },
  ];
  return (
    <>
      <SkipLink label={tA11y('skipToContent')} />
      <AppBar
        position="sticky"
        elevation={2}
        role="navigation"
        aria-label="Main navigation"
        data-testid={testId}
      >
        <Toolbar sx={{ gap: 1 }}>
          <MobileDrawer links={LINKS} />
          <NavbarLogo label={tCommon('appName')} />
          <NavLinks links={LINKS} />
          <Box sx={{ flexGrow: 1 }} />
          <DesktopActions
            onSearch={onSearch ?? (() => {})}
          />
          <NotificationBell
            onClick={onNotificationClick}
          />
          <AvatarMenu
            user={user}
            onLogout={logout}
          />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
