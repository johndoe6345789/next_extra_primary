'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { SearchBar } from './SearchBar';
import s from
  '@shared/scss/modules/DrawerSearch.module.scss';

/** Props for DrawerSearch. */
export interface DrawerSearchProps {
  /** Search callback. */
  onSearch: (q: string) => void;
}

/**
 * Full-width search field for the mobile
 * drawer. Mirrors DesktopActions search.
 *
 * @param props - Component props.
 */
export const DrawerSearch: React.FC<
  DrawerSearchProps
> = ({ onSearch }) => {
  const t = useTranslations('common');
  return (
    <div
      className={s.root}
      data-testid="drawer-search"
    >
      <SearchBar
        onSearch={onSearch}
        placeholder={`${t('search')}...`}
        testId="drawer-search-input"
      />
    </div>
  );
};

export default DrawerSearch;
