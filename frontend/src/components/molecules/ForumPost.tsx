'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { useAuth } from '@/hooks/useAuth';
import { useUpdatePostMutation } from '@/store/api/forumApi';
import type { ForumPost as ForumPostType }
  from '@/types/content';
import { ForumPostAside } from './ForumPostAside';
import { MarkdownView } from './MarkdownView';
import { ForumPostEditForm } from './ForumPostEditForm';
import { formatDate } from './forumPostUtils';
import s from './ForumPost.module.scss';

/** Props for ForumPost. */
export interface ForumPostProps {
  post: ForumPostType;
  index?: number;
}

/**
 * phpBB-style post card. Left aside shows avatar,
 * author name, mafia rank, and post count.
 * Right panel shows rendered markdown + meta.
 * Authors can edit their own posts inline.
 */
export function ForumPost({
  post, index,
}: ForumPostProps): React.ReactElement {
  const t = useTranslations('forum');
  const { user } = useAuth();
  const [updatePost] = useUpdatePostMutation();
  const [isEditing, setIsEditing] = useState(false);

  const author =
    post.authorName?.trim() || t('unknownAuthor');
  const canBan =
    user?.role === 'moderator' || user?.role === 'admin';

  const handleSave = async (body: string) => {
    await updatePost({ id: post.id, body }).unwrap();
    setIsEditing(false);
  };

  return (
    <Box
      data-testid={`forum-post-${post.id}`}
      aria-label={t('post')}
      className={s.post}
    >
      <ForumPostAside
        authorId={post.author}
        authorName={author}
        postCount={post.authorPostCount ?? 0}
        canBan={canBan}
        isSelf={user?.id === post.author}
        onBan={() => {/* TODO: open ban modal */}}
        onEdit={() => setIsEditing(true)}
      />
      <Box className={s.main}>
        <Box className={s.meta}>
          <Typography component="span" className={s.date}>
            {formatDate(post.createdAt)}
          </Typography>
          {typeof index === 'number' && (
            <Typography
              component="span" className={s.indexBadge}
            >
              #{index}
            </Typography>
          )}
        </Box>
        <Box className={s.body}>
          {isEditing ? (
            <ForumPostEditForm
              initialBody={post.body}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <MarkdownView source={post.body} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ForumPost;
