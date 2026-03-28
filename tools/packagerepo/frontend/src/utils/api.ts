/**
 * API URL resolution utilities for packagerepo frontend.
 * Determines the correct backend URL based on environment
 * and deployment context.
 */

/** Default backend port for local development. */
const DEFAULT_BACKEND_PORT = '5050';

/** Default local backend URL. */
const DEFAULT_LOCAL_URL =
  `http://localhost:${DEFAULT_BACKEND_PORT}`;

/**
 * Get the API base URL for making backend requests.
 *
 * In the browser, returns empty string so requests use
 * the Next.js rewrite proxy (avoids CORS). On the server
 * or when NEXT_PUBLIC_API_URL is set, returns the direct
 * backend URL.
 *
 * @returns The API base URL string
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined') {
    return '';
  }

  return DEFAULT_LOCAL_URL;
}
