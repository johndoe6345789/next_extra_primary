/**
 * Auth Fetch Interceptor
 * Wraps native fetch to inject auth headers
 */

/**
 * Initialize global fetch interceptor
 * Automatically adds Authorization header
 * from localStorage to all fetch requests.
 */
export function initAuthInterceptor(): void {
  if (typeof window === 'undefined') return

  const originalFetch = window.fetch

  window.fetch = function (
    ...args: Parameters<typeof fetch>
  ) {
    const [resource, config = {}] = args
    const token =
      localStorage.getItem('auth_token')

    if (token) {
      const headers = new Headers(
        config.headers || {}
      )
      headers.set(
        'Authorization',
        `Bearer ${token}`
      )
      ;(config as RequestInit).headers = headers
    }

    return originalFetch.apply(window, [
      resource,
      config,
    ] as [RequestInfo | URL, RequestInit?])
  }
}
