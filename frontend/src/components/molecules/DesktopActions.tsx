'use client';

import React from 'react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';

/** Props for DesktopActions. */
export interface DesktopActionsProps {
  /** Search callback. */
  onSearch: (q: string) => void;
}

/**
 * Desktop toolbar: search, theme, locale.
 *
 * @param props - Component props.
 */
export const DesktopActions: React.FC<
  DesktopActionsProps
> = ({ onSearch }) => (
  <div
    className="desktop-actions"
    data-testid="navbar-desktop-actions"
  >
    <SearchBar compact onSearch={onSearch} />
    <ThemeToggle />
    <LocaleSwitcher />
  </div>
);

export default DesktopActions;
