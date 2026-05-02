'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SearchBar } from './SearchBar';
import s from
  '@shared/scss/modules/DrawerSearch.module.scss';

/**
 * Full-width search field for the mobile drawer.
 * The SearchBar is self-contained — it owns its
 * query state and submit/suggest behaviour.
 */
export const DrawerSearch: React.FC = () => {
  const t = useTranslations('common');
  return (
    <div
      className={s.root}
      data-testid="drawer-search"
    >
      <SearchBar
        placeholder={`${t('search')}...`}
        testId="drawer-search-input"
      />
    </div>
  );
};

export default DrawerSearch;
