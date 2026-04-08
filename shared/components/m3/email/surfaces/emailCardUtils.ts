/**
 * Utility functions for EmailCard component.
 */

/**
 * Format a timestamp into a display date string.
 * Shows time if today, otherwise short date.
 */
export function formatEmailDate(
  receivedAt: number
): string {
  const date = new Date(receivedAt)
  const today = new Date()
  const isToday =
    date.toDateString() === today.toDateString()

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get the ISO date string for a timestamp.
 */
export function getIsoDate(
  receivedAt: number
): string {
  return new Date(receivedAt).toISOString()
}
