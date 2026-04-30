'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Icon } from '@shared/m3/data-display/Icon';
import { Link } from '@/i18n/navigation';
import type { ForumThread } from '@/types/forum';
import { ForumThreadRow } from
  '../molecules/ForumThreadRow';
import boards from '@/constants/forum-boards.json';
import s from './ForumBoardSection.module.scss';

/** Props for ForumBoardSection. */
export interface ForumBoardSectionProps {
  /** Board slug, e.g. "general". */
  slug: string;
  /** Threads in this board. */
  threads: ForumThread[];
  /** Cap threads shown; the rest behind "view all". */
  limit?: number;
  /** Hide the per-board thread count badge. */
  hideCount?: boolean;
}

/** Lookup helper with safe fallback for unknown slugs. */
function getBoardMeta(slug: string) {
  const known = boards as Record<
    string,
    { label: string; description: string; icon: string }
  >;
  return known[slug] ?? {
    label: slug.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: '',
    icon: 'forum',
  };
}

/**
 * One phpBB-style section: a coloured header with the
 * board name + description, followed by a card-style
 * list of threads in that board.
 */
export const ForumBoardSection: React.FC<
  ForumBoardSectionProps
> = ({ slug, threads, limit, hideCount }) => {
  const meta = getBoardMeta(slug);
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
          <Icon size="lg" color="primary">
            {meta.icon}
          </Icon>
        </Box>
        <Box className={s.headerText}>
          <Typography
            component="h2"
            className={s.label}
          >
            {meta.label}
          </Typography>
          {meta.description && (
            <Typography
              component="span"
              className={s.description}
            >
              {meta.description}
            </Typography>
          )}
        </Box>
        {!hideCount && (
          <Box className={s.count}>
            <Typography
              component="span"
              className={s.countNum}
            >
              {threads.length}
            </Typography>
            <Typography
              component="span"
              className={s.countLabel}
            >
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
};

export default ForumBoardSection;
