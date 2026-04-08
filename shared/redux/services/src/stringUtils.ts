/**
 * String utility functions
 */

/**
 * Combine class names, filtering falsy values.
 * Simple replacement for tailwind-merge/clsx.
 */
export function cn(
  ...classes: (
    string | undefined | null | false
  )[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(
  bytes: number
): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = [
    'Bytes', 'KB', 'MB', 'GB', 'TB',
  ];
  const i = Math.floor(
    Math.log(bytes) / Math.log(k)
  );
  const val = Math.round(
    bytes / Math.pow(k, i) * 100
  ) / 100;
  return `${val} ${sizes[i]}`;
}

/**
 * Format a timestamp to a locale date string
 */
export function formatDate(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Date(timestamp)
    .toLocaleDateString(undefined, options);
}

/**
 * Format a timestamp to locale date-time string
 */
export function formatDateTime(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Date(timestamp)
    .toLocaleString(undefined, options);
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to max length with ellipsis
 */
export function truncate(
  str: string,
  maxLength: number
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
