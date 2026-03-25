'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { SearchBar } from '../molecules/SearchBar';
import { NotificationBell } from '../molecules/NotificationBell';
import { ThemeToggle } from '../molecules/ThemeToggle';
import { LocaleSwitcher } from '../molecules/LocaleSwitcher';
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
 * App bar with logo, links, search, theme,
 * locale, notifications, avatar. Skip-to-content.
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
      <a
        href="#main-content"
        className="sr-only"
        data-testid="skip-to-content"
        tabIndex={0}
      >
        {tA11y('skipToContent')}
      </a>
      <AppBar
        position="sticky"
        role="navigation"
        aria-label="Main navigation"
        data-testid={testId}
      >
        <Toolbar sx={{ gap: 1 }}>
          <MobileDrawer links={LINKS} />
          <MuiLink
            component={Link}
            href="/"
            underline="none"
            color="inherit"
            data-testid="navbar-logo"
          >
            <Typography variant="h6">{tCommon('appName')}</Typography>
          </MuiLink>
          <NavLinks links={LINKS} />
          <Box sx={{ flexGrow: 1 }} />
          <SearchBar onSearch={onSearch ?? (() => {})} />
          <NotificationBell onClick={onNotificationClick} />
          <ThemeToggle />
          <LocaleSwitcher />
          <AvatarMenu user={user} onLogout={logout} />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
