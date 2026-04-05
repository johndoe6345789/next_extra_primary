'use client';

import React from 'react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import s from '@shared/scss/modules/DesktopActions.module.scss';

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
    className={s.root}
    data-testid="navbar-desktop-actions"
  >
    <div className={s.search}>
      <SearchBar compact onSearch={onSearch} />
    </div>
    <ThemeToggle />
    <div
      className={s.locale}
      data-testid="locale-pill"
    >
      <LocaleSwitcher />
    </div>
  </div>
);

export default DesktopActions;
