'use client';

import React from 'react';
import Box from '@metabuilder/m3/Box';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';

/** Props for DesktopActions. */
export interface DesktopActionsProps {
  /** Search callback. */
  onSearch: (q: string) => void;
  /** Notification click callback. */
  onNotificationClick?: () => void;
}

/**
 * Desktop-only toolbar actions: search, theme
 * toggle, and locale switcher. Hidden on xs/sm.
 *
 * @param props - Component props.
 */
export const DesktopActions: React.FC<
  DesktopActionsProps
> = ({ onSearch }) => (
  <Box
    sx={{
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      gap: 0.5,
    }}
    data-testid="navbar-desktop-actions"
  >
    <SearchBar compact onSearch={onSearch} />
    <ThemeToggle />
    <LocaleSwitcher />
  </Box>
);

export default DesktopActions;
