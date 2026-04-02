'use client';

import React from 'react';
import {
  SearchBar as SharedSearchBar,
  type SearchBarProps,
} from '@shared/ui/SearchBar';

export type { SearchBarProps };

/**
 * Re-exports the shared SearchBar component.
 *
 * @param props - Component props.
 * @returns The search bar element.
 */
export const SearchBar: React.FC<SearchBarProps> = (
  props,
) => <SharedSearchBar {...props} />;

export default SearchBar;
