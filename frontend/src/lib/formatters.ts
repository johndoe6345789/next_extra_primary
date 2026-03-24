/**
 * Display formatting utilities.
 * @module lib/formatters
 */

/**
 * Format an ISO date string for display.
 * @param iso  - ISO 8601 date string
 * @param locale - BCP 47 locale tag
 */
export function formatDate(iso: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date as a human-readable relative string
 * (e.g. "3 minutes ago", "2 days ago").
 * @param iso - ISO 8601 date string
 */
export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) {
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) {
    return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Format a number with locale-aware separators.
 * @param n - number to format
 * @param locale - BCP 47 locale tag
 */
export function formatNumber(n: number, locale = 'en-US'): string {
  return n.toLocaleString(locale);
}

/**
 * Format points with a suffix (e.g. "1,200 pts").
 * @param points - numeric point value
 */
export function formatPoints(points: number): string {
  return `${formatNumber(points)} pts`;
}

/**
 * Truncate text to a maximum length, appending an
 * ellipsis when truncated.
 * @param text - source string
 * @param max  - max characters (default 100)
 */
export function truncateText(text: string, max = 100): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '\u2026';
}
