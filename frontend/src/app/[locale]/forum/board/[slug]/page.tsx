'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Button } from '@shared/m3/Button';
import { Link } from '@/i18n/navigation';
import {
  ForumBoardSection,
} from '@/components/organisms/ForumBoardSection';
import {
  PaginationFooter,
} from '@/components/molecules/PaginationFooter';
import {
  NewThreadDialog,
} from '@/components/molecules/NewThreadDialog';
import { useForumThreads } from '@/hooks/useForumThreads';
import { useAuth } from '@/hooks/useAuth';
import boards from '@/constants/forum-boards.json';

const PAGE_SIZE = 10;

/** Per-board paginated thread list. */
export default function ForumBoardPage(): React.ReactElement {
  const t = useTranslations('forum');
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const board = slug ?? '';
  const { user } = useAuth();
  const {
    threads, total, isLoading, error, createThread,
  } = useForumThreads({ board, page, limit: PAGE_SIZE });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const meta = (boards as Record<string, { label: string }>)[board];
  const label = meta?.label
    ?? board.replace(/-/g, ' ')
       .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleCreate = async (title: string, body: string) => {
    await createThread(title, body, board);
    setDialogOpen(false);
  };

  return (
    <Box role="main" aria-label={label}
      data-testid={`forum-board-page-${board}`}
      sx={{ p: 3, maxWidth: 980, mx: 'auto' }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', mb: 1,
      }}>
        <Typography component={Link} href="/forum" sx={{
          color: 'text.secondary', textDecoration: 'none',
          fontSize: '0.875rem',
          '&:hover': { color: 'primary.main' },
        }}>
          ← {t('title')}
        </Typography>
        {user && (
          <Button variant="contained"
            onClick={() => setDialogOpen(true)}
            aria-label={t('newThread')}
            data-testid="new-thread-btn"
          >{t('newThread')}</Button>
        )}
      </Box>
      {isLoading && (
        <Typography data-testid="forum-loading">
          {t('loading')}
        </Typography>
      )}
      {error && (
        <Typography color="error" data-testid="forum-error">
          {error}
        </Typography>
      )}
      {!isLoading && !error && (
        <ForumBoardSection slug={board} threads={threads}
          hideCount />
      )}
      <PaginationFooter page={page} pageCount={pageCount}
        onChange={setPage} ns="forum"
        testId="forum-board-pagination" />
      <NewThreadDialog open={dialogOpen} boardSlug={board}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate} />
    </Box>
  );
}
