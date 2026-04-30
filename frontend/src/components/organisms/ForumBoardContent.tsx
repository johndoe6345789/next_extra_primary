'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Icon } from '@shared/m3/data-display/Icon';
import { Link } from '@/i18n/navigation';
import type { ForumThread } from '@/types/forum';
import { ForumThreadRow } from
  '../molecules/ForumThreadRow';
import s from './ForumBoardSection.module.scss';

/** Props for ForumBoardContent. */
export interface ForumBoardContentProps {
  slug: string;
  label: string;
  description?: string;
  icon: string;
  threads: ForumThread[];
  limit?: number;
  hideCount?: boolean;
}

/**
 * The open (accessible) state of a forum board:
 * clickable header + thread list + optional "view
 * all" link. Rendered by ForumBoardSection after
 * access requirements are confirmed.
 */
export function ForumBoardContent({
  slug, label, description, icon,
  threads, limit, hideCount,
}: ForumBoardContentProps): React.ReactElement {
  const visible = limit
    ? threads.slice(0, limit) : threads;
  const hidden = limit
    ? Math.max(0, threads.length - limit) : 0;
  return (
    <Box
      className={s.section}
      data-testid={`forum-board-${slug}`}
    >
      <Link
        href={`/forum/board/${slug}`}
        className={s.header}
        data-testid={`forum-board-${slug}-link`}
      >
        <Box className={s.iconWrap}>
          <Icon size="lg" color="primary">{icon}</Icon>
        </Box>
        <Box className={s.headerText}>
          <Typography component="h2"
            className={s.label}>
            {label}
          </Typography>
          {description && (
            <Typography component="span"
              className={s.description}>
              {description}
            </Typography>
          )}
        </Box>
        {!hideCount && (
          <Box className={s.count}>
            <Typography component="span"
              className={s.countNum}>
              {threads.length}
            </Typography>
            <Typography component="span"
              className={s.countLabel}>
              threads
            </Typography>
          </Box>
        )}
      </Link>
      <Box className={s.body}>
        {visible.map((th) => (
          <ForumThreadRow key={th.id} thread={th} />
        ))}
      </Box>
      {hidden > 0 && (
        <Link
          href={`/forum/board/${slug}`}
          className={s.viewAll}
          data-testid={`forum-board-${slug}-viewall`}
        >
          View all {threads.length} threads →
        </Link>
      )}
    </Box>
  );
}

export default ForumBoardContent;
