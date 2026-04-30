'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography, Avatar } from '@shared/m3';
import type { ForumPost as ForumPostType }
  from '@/types/content';
import s from './ForumPost.module.scss';

/** Props for ForumPost. */
export interface ForumPostProps {
  /** Post data object. */
  post: ForumPostType;
  /** 1-based index in the visible page. */
  index?: number;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) {
    return parts[0][0]!.toUpperCase();
  }
  return (
    parts[0][0]! + parts[parts.length - 1][0]!
  ).toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * phpBB-style post card: avatar column on the left,
 * post body on the right with author + timestamp meta.
 */
export function ForumPost({
  post, index,
}: ForumPostProps): React.ReactElement {
  const t = useTranslations('forum');
  const author =
    post.authorName?.trim() || t('unknownAuthor');
  return (
    <Box
      data-testid={`forum-post-${post.id}`}
      aria-label={t('post')}
      className={s.post}
    >
      <Box className={s.aside}>
        <Avatar
          aria-label={author}
          className={s.avatar}
        >
          {initials(author)}
        </Avatar>
        <Typography
          component="span"
          className={s.authorName}
        >
          {author}
        </Typography>
      </Box>
      <Box className={s.main}>
        <Box className={s.meta}>
          <Typography
            component="span"
            className={s.date}
          >
            {formatDate(post.createdAt)}
          </Typography>
          {typeof index === 'number' && (
            <Typography
              component="span"
              className={s.indexBadge}
            >
              #{index}
            </Typography>
          )}
        </Box>
        <Box className={s.body}>
          {post.body.split('\n').map((line, i) => (
            <Typography
              key={i}
              component="p"
              className={s.bodyLine}
            >
              {line || ' '}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ForumPost;
