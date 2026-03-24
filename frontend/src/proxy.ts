import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 proxy (replaces the deprecated middleware
 * convention). Delegates to next-intl's locale detection
 * and rewriting logic.
 *
 * The matcher excludes API routes, static assets, and
 * image optimisation paths so the proxy only runs on
 * page navigations.
 */
const handleI18n = createMiddleware(routing);

/**
 * Proxy entry point.
 *
 * @param request - The incoming server request.
 * @returns A response with the appropriate locale rewrite.
 */
export function proxy(request: NextRequest) {
  return handleI18n(request);
}

/** Routes the proxy should intercept. */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api       (API routes)
     * - _next     (Next.js internals)
     * - _vercel   (Vercel internals)
     * - .*\\..*   (files with extensions e.g. favicon.ico)
     */
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
