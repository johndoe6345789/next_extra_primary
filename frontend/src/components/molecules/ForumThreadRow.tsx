'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Link } from '@/i18n/navigation';
import type { ForumThread } from '@/types/forum';
import s from './ForumThreadRow.module.scss';

/** Props for ForumThreadRow. */
export interface ForumThreadRowProps {
  /** Thread to render. */
  thread: ForumThread;
}

function formatRelative(iso?: string): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

/**
 * One row in the phpBB-style forum table. Title +
 * author on the left; reply count and last-activity
 * stamp on the right.
 */
export const ForumThreadRow: React.FC<
  ForumThreadRowProps
> = ({ thread }) => {
  const t = useTranslations('forum');
  const author = thread.authorName?.trim()
    || t('unknownAuthor');
  const last = thread.lastReplyAt || thread.createdAt;

  return (
    <Link
      href={`/forum/${thread.id}`}
      className={s.row}
      data-testid={`forum-thread-${thread.id}`}
    >
      <Box className={s.main}>
        <Typography
          component="span"
          className={s.title}
        >
          {thread.title}
        </Typography>
        <Typography
          component="span"
          className={s.meta}
        >
          by {author} · started{' '}
          {formatRelative(thread.createdAt)}
        </Typography>
      </Box>
      <Box className={s.stats}>
        <Box className={s.replies}>
          <Typography
            component="span"
            className={s.replyCount}
          >
            {thread.replyCount}
          </Typography>
          <Typography
            component="span"
            className={s.replyLabel}
          >
            {t('replies')}
          </Typography>
        </Box>
        <Typography
          component="span"
          className={s.lastActivity}
        >
          {formatRelative(last)}
        </Typography>
      </Box>
    </Link>
  );
};

export default ForumThreadRow;
