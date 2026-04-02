'use client';

import React from 'react';
import AppBar from '@shared/m3/AppBar';
import Toolbar from '@shared/m3/Toolbar';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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
  const router = useRouter();
  const { user, logout } = useAuth();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const TOP_LINKS = [
    { label: tNav('dashboard'), href: '/dashboard' },
    { label: tNav('leaderboard'), href: '/leaderboard' },
    { label: tNav('chat'), href: '/chat' },
  ];
  const ALL_LINKS = [
    ...TOP_LINKS,
    { label: tNav('notifications'), href: '/notifications' },
    { label: tNav('profile'), href: '/profile' },
    { label: tNav('about'), href: '/about' },
    { label: tNav('contact'), href: '/contact' },
  ];
  return (
    <>
      <SkipLink label={tA11y('skipToContent')} />
      <AppBar
        position="sticky"
        role="navigation"
        aria-label="Main navigation"
        data-testid={testId}
      >
        <Toolbar>
          <MobileDrawer links={ALL_LINKS} />
          <NavbarLogo label={tCommon('appName')} />
          <NavLinks links={TOP_LINKS} />
          <div className="spacer" />
          <DesktopActions
            onSearch={onSearch ?? (() => {})}
          />
          <NotificationBell
            onClick={onNotificationClick
              ?? (() => router.push('/notifications'))}
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
