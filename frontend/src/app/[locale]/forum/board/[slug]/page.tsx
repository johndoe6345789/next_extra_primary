'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Pagination } from '@shared/m3/navigation';
import { Link } from '@/i18n/navigation';
import {
  ForumBoardSection,
} from '@/components/organisms/ForumBoardSection';
import { useForumThreads } from '@/hooks/useForumThreads';
import boards from '@/constants/forum-boards.json';

const PAGE_SIZE = 20;

/** Per-board paginated thread list. */
export default function ForumBoardPage(): React.ReactElement {
  const t = useTranslations('forum');
  const { slug } =
    useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const board = slug ?? '';
  const { threads, total, isLoading, error } =
    useForumThreads({ board, page, limit: PAGE_SIZE });
  const pageCount = Math.max(
    1, Math.ceil(total / PAGE_SIZE),
  );
  const meta = (boards as Record<
    string, { label: string }
  >)[board];
  const label = meta?.label
    ?? board.replace(/-/g, ' ')
       .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Box
      role="main"
      aria-label={label}
      data-testid={`forum-board-page-${board}`}
      sx={{ p: 3, maxWidth: 980, mx: 'auto' }}
    >
      <Typography
        component={Link}
        href="/forum"
        sx={{
          display: 'inline-block',
          mb: 1,
          color: 'text.secondary',
          textDecoration: 'none',
          fontSize: '0.875rem',
          '&:hover': { color: 'primary.main' },
        }}
      >
        ← {t('title')}
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
      {!isLoading && !error && (
        <ForumBoardSection
          slug={board}
          threads={threads}
          hideCount
        />
      )}
      {pageCount > 1 && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
        }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={setPage}
            aria-label={t('pagination')}
            data-testid="forum-board-pagination"
          />
        </Box>
      )}
    </Box>
  );
}
