'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box, Typography, CircularProgress,
} from '@shared/m3';
import { Pagination } from '@shared/m3/navigation';
import { Link } from '@/i18n/navigation';
import { useForumThread } from '@/hooks/useForumThread';
import { ForumPost } from '@/components/molecules/ForumPost';
import {
  ForumReplyComposer,
} from '@/components/molecules/ForumReplyComposer';
import boards from '@/constants/forum-boards.json';

const POSTS_PER_PAGE = 25;

/** phpBB-style thread page: breadcrumb, opening
 *  post, paginated replies, reply composer. */
export default function ForumThreadPage(): React.ReactElement {
  const t = useTranslations('forum');
  const { threadId } =
    useParams<{ threadId: string }>();
  const [postPage, setPostPage] = useState(1);
  const {
    thread, posts, postTotal, isLoading, error, reply,
  } = useForumThread(threadId ?? '', postPage);
  const pageCount = Math.max(
    1, Math.ceil(postTotal / POSTS_PER_PAGE),
  );

  if (isLoading) {
    return (
      <Box
        sx={{ p: 4, display: 'flex',
          justifyContent: 'center' }}
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

  const board = thread.board ?? 'general';
  const meta = (boards as Record<
    string, { label: string }
  >)[board];
  const boardLabel = meta?.label ?? board;
  const startIdx = (postPage - 1) * POSTS_PER_PAGE;

  return (
    <Box
      role="main"
      aria-label={thread.title}
      data-testid="forum-thread-page"
      sx={{ p: 3, maxWidth: 980, mx: 'auto' }}
    >
      <Typography
        component="nav"
        sx={{
          mb: 2,
          fontSize: '0.875rem',
          color: 'text.secondary',
        }}
      >
        <Link href="/forum"
          style={{ color: 'inherit' }}>
          {t('title')}
        </Link>
        {' › '}
        <Link href={`/forum/board/${board}`}
          style={{ color: 'inherit' }}>
          {boardLabel}
        </Link>
      </Typography>
      <Typography
        variant="h5"
        component="h1"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        {thread.title}
      </Typography>
      {/* Opening post is the thread row itself.    */}
      {postPage === 1 && (
        <ForumPost
          post={{
            id: thread.id,
            threadId: thread.id,
            author: thread.author,
            authorName: thread.authorName,
            body: thread.body ?? '',
            createdAt: thread.createdAt,
          }}
          index={1}
        />
      )}
      {posts.map((post, i) => (
        <ForumPost
          key={post.id}
          post={post}
          index={startIdx + i + 2}
        />
      ))}
      {pageCount > 1 && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          my: 2,
        }}>
          <Pagination
            count={pageCount}
            page={postPage}
            onChange={setPostPage}
            aria-label={t('pagination')}
            data-testid="forum-thread-pagination"
          />
        </Box>
      )}
      <ForumReplyComposer onSubmit={reply} />
    </Box>
  );
}
