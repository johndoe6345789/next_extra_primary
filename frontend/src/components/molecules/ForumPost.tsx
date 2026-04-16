'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Avatar,
} from '@shared/m3';
import type { ForumPost as ForumPostType } from '@/types/content';

/** Props for ForumPost. */
export interface ForumPostProps {
  /** Post data object. */
  post: ForumPostType;
  /** Indent depth for nesting. */
  depth?: number;
}

/**
 * Single forum post with author, body, timestamp.
 *
 * @param props - ForumPost component props.
 * @returns Rendered post card.
 */
export function ForumPost({
  post,
  depth = 0,
}: ForumPostProps): React.ReactElement {
  const t = useTranslations('forum');
  const initial =
    (post.author ?? '?')[0]?.toUpperCase() ?? '?';

  return (
    <Box
      data-testid={`forum-post-${post.id}`}
      aria-label={t('post')}
      sx={{
        ml: depth * 3,
        mb: 2,
        p: 2,
        borderLeft: depth > 0 ? '2px solid' : 'none',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
        <Avatar
          aria-label={post.author ?? t('unknownAuthor')}
          sx={{ width: 32, height: 32, fontSize: 14 }}
        >
          {initial}
        </Avatar>
        <Box>
          <Typography variant="subtitle2">
            {post.author ?? t('unknownAuthor')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2">{post.body}</Typography>
    </Box>
  );
}

export default ForumPost;
