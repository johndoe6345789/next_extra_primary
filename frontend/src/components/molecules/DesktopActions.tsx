'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { LocaleSwitcher } from './LocaleSwitcher';
import s from '@shared/scss/modules/DesktopActions.module.scss';

/**
 * Desktop toolbar: search, theme, locale. The
 * SearchBar is self-contained — it owns its query
 * state, debounces /api/search/suggest, and routes
 * to /search on submit.
 */
export const DesktopActions: React.FC = () => {
  const t = useTranslations('common');
  return (
    <div
      className={s.root}
      data-testid="navbar-desktop-actions"
    >
      <div className={s.search}>
        <SearchBar
          compact
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
