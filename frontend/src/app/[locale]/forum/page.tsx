'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Pagination } from '@shared/m3/navigation';
import {
  ForumBoardSection,
} from '@/components/organisms/ForumBoardSection';
import { useForumThreads } from '@/hooks/useForumThreads';
import boards from '@/constants/forum-boards.json';
import content from '@/constants/content.json';
import type { ForumThread } from '@/types/forum';

/** Order: registry boards first (in their declared
 *  order), then any unknown slugs alphabetically. */
function groupByBoard(
  threads: ForumThread[],
): Array<{ slug: string; threads: ForumThread[] }> {
  const groups = new Map<string, ForumThread[]>();
  for (const t of threads) {
    const slug = t.board ?? 'general';
    if (!groups.has(slug)) groups.set(slug, []);
    groups.get(slug)!.push(t);
  }
  const reg = boards as Record<
    string, { order: number }
  >;
  return [...groups.entries()]
    .sort(([a], [b]) => {
      const oa = reg[a]?.order ?? 1000;
      const ob = reg[b]?.order ?? 1000;
      if (oa !== ob) return oa - ob;
      return a.localeCompare(b);
    })
    .map(([slug, t]) => ({ slug, threads: t }));
}

/** Forum thread index, grouped by board (phpBB-style). */
export default function ForumPage(): React.ReactElement {
  const t = useTranslations('forum');
  const [page, setPage] = useState(1);
  const { threads, total, isLoading, error } =
    useForumThreads(page);

  const grouped = useMemo(
    () => groupByBoard(threads), [threads],
  );
  const pageCount = Math.ceil(
    total / content.forum.pageSize,
  );

  return (
    <Box
      role="main"
      aria-label={t('title')}
      data-testid="forum-page"
      sx={{ p: 3, maxWidth: 980, mx: 'auto' }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        {t('title')}
      </Typography>
      {isLoading && (
        <Typography data-testid="forum-loading">
          {t('loading')}
        </Typography>
      )}
      {error && (
        <Typography
          color="error"
          data-testid="forum-error"
        >
          {error}
        </Typography>
      )}
      {grouped.map(({ slug, threads: ts }) => (
        <ForumBoardSection
          key={slug}
          slug={slug}
          threads={ts}
        />
      ))}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={setPage}
          aria-label={t('pagination')}
          data-testid="forum-pagination"
        />
      )}
    </Box>
  );
}
