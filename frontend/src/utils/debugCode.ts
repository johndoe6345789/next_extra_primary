/**
 * Generates short, human-readable debug codes
 * from error info + timestamp.
 * @module utils/debugCode
 */

/**
 * Generate a short debug code from error details.
 * Format: NX-{hash}-{ts} e.g. NX-A3F2-1712500800
 *
 * @param error - Error message or name.
 * @returns A short debug reference code.
 */
export function generateDebugCode(
  error: string,
): string {
  const ts = Math.floor(Date.now() / 1000);
  let hash = 0;
  for (let i = 0; i < error.length; i++) {
    hash = ((hash << 5) - hash + error.charCodeAt(i))
      | 0;
  }
  const hex = Math.abs(hash)
    .toString(16).toUpperCase().slice(0, 4)
    .padStart(4, '0');
  return `NX-${hex}-${ts}`;
}
