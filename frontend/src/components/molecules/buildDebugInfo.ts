/**
 * Builds a copyable debug info string from
 * recent API calls and error details.
 * @module components/molecules/buildDebugInfo
 */
import { getDebugEntries } from '@/utils/debugStore';

/**
 * Assemble debug diagnostic info as a
 * newline-delimited string suitable for
 * clipboard copy.
 *
 * @param debugCode - Error reference code.
 * @param message - Error message text.
 * @returns Formatted debug info string.
 */
export function buildDebugInfo(
  debugCode: string,
  message: string,
): string {
  const recent = getDebugEntries().slice(0, 5);
  return [
    `Debug Code: ${debugCode}`,
    `Error: ${message}`,
    `Time: ${new Date().toISOString()}`,
    `URL: ${window.location.href}`,
    `UA: ${navigator.userAgent}`,
    '',
    'Recent API calls:',
    ...recent.map((e) =>
      `  ${e.method} ${e.url} -> ${e.status}`
      + ` [${e.requestId}] ${e.duration}ms`
      + (e.errorCode
        ? ` (${e.errorCode})` : ''),
    ),
  ].join('\n');
}
