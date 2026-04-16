'use client';

/**
 * User search input + result list for NewDmDialog.
 * @module components/organisms/NewDmUserSearch
 */

import React from 'react';
import { Box, Typography } from '@shared/m3';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';
import type { UserProfile } from '@/types/user';

/** Props for NewDmUserSearch. */
export interface NewDmUserSearchProps {
  /** Current search query. */
  query: string;
  /** Called on query change. */
  onQueryChange: (q: string) => void;
  /** Search result users. */
  results: UserProfile[];
  /** True while API is fetching. */
  searching: boolean;
  /** Called when a user is selected. */
  onSelect: (user: UserProfile) => void;
  /** True while thread is being created. */
  creating: boolean;
}

/**
 * Renders a search field and a list of user results.
 * @param props - Component props.
 */
const NewDmUserSearch: React.FC<NewDmUserSearchProps> = ({
  query,
  onQueryChange,
  results,
  searching,
  onSelect,
  creating,
}) => {
  const t = useTranslations('social');
  return (
    <Box
      data-testid="new-dm-user-search"
      aria-label={t('newDm.searchLabel')}
    >
      <TextField
        label={t('newDm.searchPlaceholder')}
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
        fullWidth
        disabled={creating}
        data-testid="new-dm-search-input"
      />
      {searching && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {t('loading')}
        </Typography>
      )}
      <Box
        component="ul"
        sx={{ listStyle: 'none', p: 0, mt: 1 }}
        aria-label={t('newDm.resultsList')}
      >
        {results.map((user) => (
          <Box
            key={user.id}
            component="li"
            data-testid={`new-dm-user-${user.id}`}
            aria-label={user.displayName}
            onClick={() => !creating && onSelect(user)}
            sx={{
              px: 2,
              py: 1,
              cursor: creating ? 'default' : 'pointer',
              '&:hover': creating
                ? {}
                : { bgcolor: 'action.hover' },
            }}
          >
            <Typography variant="body2">
              {user.displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.username}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default NewDmUserSearch;
