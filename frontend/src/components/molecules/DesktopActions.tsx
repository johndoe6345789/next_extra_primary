'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
> = ({ onSearch }) => {
  const t = useTranslations('common');
  return (
  <div
    className={s.root}
    data-testid="navbar-desktop-actions"
  >
    <div className={s.search}>
      <SearchBar
        compact
        onSearch={onSearch}
        placeholder={`${t('search')}...`}
      />
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
};

export default DesktopActions;
