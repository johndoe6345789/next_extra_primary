'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
} from '@shared/m3';
import {
  List,
  ListItemButton,
  ListItemText,
} from '@shared/m3/data-display';
import { Pagination } from '@shared/m3/navigation';
import { Link } from '@/i18n/navigation';
import { useForumThreads } from '@/hooks/useForumThreads';
import content from '@/constants/content.json';

/**
 * Forum thread list page.
 *
 * @returns Forum index page UI.
 */
export default function ForumPage(): React.ReactElement {
  const t = useTranslations('forum');
  const [page, setPage] = useState(1);
  const { threads, total, isLoading, error } =
    useForumThreads(page);
  const pageCount = Math.ceil(
    total / content.forum.pageSize,
  );

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      data-testid="forum-page"
      sx={{ p: 3, maxWidth: 860, mx: 'auto' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
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
      <List>
        {threads.map((thread) => (
          <ListItemButton
            key={thread.id}
            component={Link}
            href={`/forum/${thread.id}`}
            aria-label={thread.title}
            data-testid={`forum-thread-${thread.id}`}
          >
            <ListItemText
              primary={thread.title}
              secondary={`${thread.replyCount} ${t('replies')} · ${new Date(thread.createdAt).toLocaleDateString()}`}
            />
          </ListItemButton>
        ))}
      </List>
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
