'use client';

import React, { useCallback, useState } from 'react';
import AppBar from '@shared/m3/AppBar';
import Toolbar from '@shared/m3/Toolbar';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { SkipLink } from '../molecules/SkipLink';
import { NavbarLogo } from '@shared/components/ui/NavbarLogo';
import { DesktopActions } from '../molecules/DesktopActions';
import { NotificationBell } from '../molecules/NotificationBell';
import { AvatarMenu } from './AvatarMenu';
import { MobileDrawer } from './MobileDrawer';
import { NotificationPanel } from './NotificationPanel';

/** Props for the Navbar organism. */
export interface NavbarProps {
  onSearch?: (q: string) => void;
  testId?: string;
}

/** App bar with drawer, logo, actions, balloon. */
export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  testId = 'navbar',
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const { user, logout } = useAuth();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tA11y = useTranslations('a11y');

  const toggle = useCallback(
    () => setPanelOpen((v) => !v),
    [],
  );

  const LINKS = [
    { label: tNav('dashboard'), href: '/dashboard' },
    { label: tNav('leaderboard'), href: '/leaderboard' },
    { label: tNav('chat'), href: '/chat' },
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
          <MobileDrawer links={LINKS} />
          <NavbarLogo
            label={tCommon('appName')}
          />
          <div className="spacer" />
          <DesktopActions
            onSearch={onSearch ?? (() => {})}
          />
          <NotificationBell onClick={toggle} />
          <AvatarMenu
            user={user}
            onLogout={logout}
          />
        </Toolbar>
      </AppBar>
      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
};

export default Navbar;
