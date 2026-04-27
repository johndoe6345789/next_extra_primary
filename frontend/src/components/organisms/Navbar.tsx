'use client';

import React, { useState } from 'react';
import AppBar from '@shared/m3/AppBar';
import Toolbar from '@shared/m3/Toolbar';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@shared/m3/Button';
import { useAuth } from '@/hooks';
import { SkipLink } from '../molecules/SkipLink';
import { NavbarLogo } from '@shared/components/ui/NavbarLogo';
import { DesktopActions } from '../molecules/DesktopActions';
import { NotificationBell } from '../molecules/NotificationBell';
import { MentionsBell } from '../molecules/MentionsBell';
import { CartButton } from '../molecules/CartButton';
import { AvatarMenu } from './AvatarMenu';
import { MobileDrawer } from './MobileDrawer';
import { NotificationPanel } from './NotificationPanel';
import navLinks from '@/constants/nav-links.json';
import { FeatureFlagGate } from
  '@/components/atoms/FeatureFlagGate';

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
  const { user, isAuthenticated, logout } = useAuth();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tA11y = useTranslations('a11y');

  const toggle = () => setPanelOpen((v) => !v);

  const LINKS = navLinks.map((l) => ({
    label: tNav(l.labelKey),
    href: l.href,
  }));

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
          <MobileDrawer links={LINKS} onSearch={onSearch} />
          <NavbarLogo label={tCommon('appName')} />
          <div className="spacer" />
          <DesktopActions onSearch={onSearch ?? (() => {})} />
          {isAuthenticated ? (
            <>
              <FeatureFlagGate flag="social">
                <MentionsBell />
              </FeatureFlagGate>
              <FeatureFlagGate flag="ecommerce">
                <CartButton />
              </FeatureFlagGate>
              <NotificationBell onClick={toggle} />
              <AvatarMenu user={user} onLogout={logout} />
            </>
          ) : (
            <Button
              component={Link} href="/login"
              variant="text" testId="navbar-login"
              style={LOGIN_STYLE}
            >
              {tAuth('login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
};

const LOGIN_STYLE = {
  whiteSpace: 'nowrap' as const,
  flexShrink: 0,
};

export default Navbar;
