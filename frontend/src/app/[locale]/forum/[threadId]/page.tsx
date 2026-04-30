'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box, Typography, CircularProgress,
} from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useForumThread } from '@/hooks/useForumThread';
import { usePostsPerPage } from '@/hooks/usePostsPerPage';
import { ForumPost } from '@/components/molecules/ForumPost';
import {
  ForumReplyComposer,
} from '@/components/molecules/ForumReplyComposer';
import {
  PaginationFooter,
} from '@/components/molecules/PaginationFooter';
import boards from '@/constants/forum-boards.json';

/** phpBB-style thread page: breadcrumb, opening
 *  post, paginated replies, reply composer. */
export default function ForumThreadPage(): React.ReactElement {
  const t = useTranslations('forum');
  const { threadId } =
    useParams<{ threadId: string }>();
  const [postPage, setPostPage] = useState(1);
  const postsPerPage = usePostsPerPage();
  const {
    thread, posts, postTotal, isLoading, error, reply,
  } = useForumThread(threadId ?? '', postPage, postsPerPage);
  // +1 because the opening post occupies one slot on page 1.
  const pageCount = Math.max(
    1, Math.ceil((postTotal + 1) / postsPerPage),
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
  const startIdx = (postPage - 1) * postsPerPage;

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
      {/* Opening post is the thread row itself. */}
      {postPage === 1 && (
        <ForumPost
          post={{
            id: thread.id,
            threadId: thread.id,
            author: thread.author,
            authorName: thread.authorName,
            authorPostCount: thread.authorPostCount,
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
      <PaginationFooter
        page={postPage}
        pageCount={pageCount}
        onChange={setPostPage}
        ns="forum"
        testId="forum-thread-pagination"
      />
      <ForumReplyComposer
        onSubmit={reply}
        storageKey={`forum-draft-${thread.id}`}
      />
    </Box>
  );
}
