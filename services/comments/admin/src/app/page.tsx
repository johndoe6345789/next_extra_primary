'use client';

/**
 * @file page.tsx
 * @brief Forum moderation dashboard entry.
 */

import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
} from '@shared/m3';

import { useFlagged } from '@/hooks/useFlagged';
import { FlaggedList } from './FlaggedList';
import { ThreadView } from './ThreadView';

/**
 * @brief Default export — forum moderation
 *        dashboard page.
 */
export default function ForumPage() {
  const { flagged, loading, refetch } =
    useFlagged();
  const [selected, setSelected] =
    useState<number | null>(null);

  return (
    <Box className="forum-shell">
      <Stack spacing={3}>
        <Typography variant="h4">
          Forum moderation
        </Typography>
        <Typography variant="body2">
          {loading
            ? 'Loading flagged comments…'
            : `${flagged.length} flagged`}
        </Typography>
        <FlaggedList
          items={flagged}
          selectedId={selected}
          onSelect={setSelected}
        />
        {selected !== null && (
          <ThreadView
            commentId={selected}
            onChange={refetch}
          />
        )}
      </Stack>
    </Box>
  );
}
