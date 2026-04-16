'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
} from '@shared/m3';
import { useForumThread } from '@/hooks/useForumThread';
import { ForumPost } from '@/components/molecules/ForumPost';
import { ForumReplyComposer } from '@/components/molecules/ForumReplyComposer';

/**
 * Forum thread detail page.
 *
 * Displays all posts and a reply composer.
 *
 * @returns Thread detail UI.
 */
export default function ForumThreadPage(): React.ReactElement {
  const t = useTranslations('forum');
  const { threadId } = useParams<{ threadId: string }>();
  const { thread, posts, isLoading, error, reply } =
    useForumThread(threadId ?? '');

  if (isLoading) {
    return (
      <Box
        sx={{ p: 4, display: 'flex', justifyContent: 'center' }}
        data-testid="forum-thread-loading"
      >
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (error || !thread) {
    return (
      <Box sx={{ p: 3 }} data-testid="forum-thread-error">
        <Typography color="error">
          {error ?? t('notFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      aria-label={thread.title}
      data-testid="forum-thread-page"
      sx={{ p: 3, maxWidth: 860, mx: 'auto' }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        {thread.title}
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ mb: 2, display: 'block' }}
      >
        {thread.author} ·{' '}
        {new Date(thread.createdAt).toLocaleDateString()}
      </Typography>
      {posts.map((post) => (
        <ForumPost
          key={post.id}
          post={post}
          depth={post.depth ?? 0}
        />
      ))}
      <ForumReplyComposer onSubmit={reply} />
    </Box>
  );
}
