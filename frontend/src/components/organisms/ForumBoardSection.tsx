'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useForumBoards } from '@/hooks/useForumBoards';
import type { ForumThread } from '@/types/forum';
import type { ForumBoard } from '@/types/forumBoard';
import { LockedBoardCard } from '../atoms/LockedBoardCard';
import { ForumBoardContent } from './ForumBoardContent';

/** Props for ForumBoardSection. */
export interface ForumBoardSectionProps {
  slug: string;
  threads: ForumThread[];
  limit?: number;
  hideCount?: boolean;
  /** Viewing user's post count for minPosts gating. */
  userPostCount?: number;
}

function fallbackBoard(slug: string): ForumBoard {
  return {
    slug,
    label: slug.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    description: '',
    icon: 'forum',
    requiresAuth: false,
    minPosts: 0,
    isGuestVisible: true,
    sortOrder: 0,
  };
}

/**
 * Forum board section with access gating.
 * Reads board metadata from the API via useForumBoards,
 * with static JSON as a fallback for instant first render.
 */
export const ForumBoardSection: React.FC<
  ForumBoardSectionProps
> = ({ slug, threads, limit, hideCount,
       userPostCount = 0 }) => {
  const { user } = useAuth();
  const { boards } = useForumBoards();

  const meta =
    boards.find((b) => b.slug === slug)
    ?? fallbackBoard(slug);

  if (meta.requiresAuth && !user) {
    return (
      <LockedBoardCard
        label={meta.label} description={meta.description}
        icon={meta.icon} reason="Sign in to view"
      />
    );
  }

  if (meta.minPosts && userPostCount < meta.minPosts) {
    const need = meta.minPosts - userPostCount;
    return (
      <LockedBoardCard
        label={meta.label} description={meta.description}
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
