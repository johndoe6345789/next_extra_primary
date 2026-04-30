/**
 * Utility functions for the ForumPost component.
 * @module components/molecules/forumPostUtils
 */
import ranks from '@/constants/forum-ranks.json';

/** A single mafia-rank tier entry. */
export type RankEntry = {
  minPosts: number;
  label: string;
  emoji: string;
};

/**
 * Return the highest rank the user has earned.
 * @param postCount - total posts by the author.
 */
export function getRank(postCount: number): RankEntry {
  const sorted = (ranks as RankEntry[])
    .slice()
    .sort((a, b) => b.minPosts - a.minPosts);
  return (
    sorted.find((r) => postCount >= r.minPosts)
    ?? sorted[sorted.length - 1]!
  );
}

/**
 * Return the initials for an avatar placeholder.
 * @param name - display name.
 */
export function initials(name: string): string {
  const p = name.trim().split(/\s+/);
  if (!p[0]) return '?';
  if (p.length === 1) return p[0][0]!.toUpperCase();
  return (
    p[0][0]! + p[p.length - 1]![0]!
  ).toUpperCase();
}

/**
 * Format an ISO date string for display.
 * @param iso - ISO 8601 date string.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
