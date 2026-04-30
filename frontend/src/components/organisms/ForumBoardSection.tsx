'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ForumThread } from '@/types/forum';
import { LockedBoardCard } from
  '../atoms/LockedBoardCard';
import { ForumBoardContent } from './ForumBoardContent';
import boards from '@/constants/forum-boards.json';

type BoardMeta = {
  label: string;
  description: string;
  icon: string;
  requiresAuth?: boolean;
  minPosts?: number;
};

/** Props for ForumBoardSection. */
export interface ForumBoardSectionProps {
  slug: string;
  threads: ForumThread[];
  limit?: number;
  hideCount?: boolean;
  /** Viewing user's post count for minPosts gating. */
  userPostCount?: number;
}

function getBoardMeta(slug: string): BoardMeta {
  const known = boards as Record<string, BoardMeta>;
  return known[slug] ?? {
    label: slug.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: '',
    icon: 'forum',
  };
}

/**
 * Forum board section with access gating.
 * Shows a LockedBoardCard when the user does not
 * meet requiresAuth or minPosts; delegates rendering
 * of the open board to ForumBoardContent.
 */
export const ForumBoardSection: React.FC<
  ForumBoardSectionProps
> = ({ slug, threads, limit, hideCount,
       userPostCount = 0 }) => {
  const { user } = useAuth();
  const meta = getBoardMeta(slug);

  if (meta.requiresAuth && !user) {
    return (
      <LockedBoardCard
        label={meta.label}
        description={meta.description}
        icon={meta.icon}
        reason="Sign in to view"
      />
    );
  }

  if (meta.minPosts && userPostCount < meta.minPosts) {
    const need = meta.minPosts - userPostCount;
    return (
      <LockedBoardCard
        label={meta.label}
        description={meta.description}
        icon={meta.icon}
        reason={`${need} more post${need === 1 ? '' : 's'} needed`}
      />
    );
  }

  return (
    <ForumBoardContent
      slug={slug}
      label={meta.label}
      description={meta.description}
      icon={meta.icon}
      threads={threads}
      limit={limit}
      hideCount={hideCount}
    />
  );
};

export default ForumBoardSection;
