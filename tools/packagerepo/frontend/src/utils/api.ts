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
 * Priority:
 * 1. NEXT_PUBLIC_API_URL env var (recommended for prod)
 * 2. Infer from current browser location
 * 3. Default to localhost:5050 for local development
 *
 * When NEXT_PUBLIC_API_URL is not set:
 * - localhost: defaults to http://localhost:5050
 * - Deployed on custom port: tries port 5050
 * - Deployed on standard port: empty string (rewrites)
 *
 * @returns The API base URL string
 */
export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;

    if (
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    ) {
      if (
        port &&
        port !== '80' &&
        port !== '443'
      ) {
        return `${protocol}//${hostname}:${DEFAULT_BACKEND_PORT}`;
      }
      return '';
    }

    return DEFAULT_LOCAL_URL;
  }

  return DEFAULT_LOCAL_URL;
}
