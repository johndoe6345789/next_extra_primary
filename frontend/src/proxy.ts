import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

/**
 * Path patterns (after locale strip) that require a
 * signed-in user. Anything else is open to guests.
 */
const PROTECTED = [
  /^\/admin(\/|$)/,
  /^\/profile(\/|$)/,
  /^\/settings(\/|$)/,
  /^\/notifications(\/|$)/,
  /^\/messages(\/|$)/,
  /^\/shop\/checkout(\/|$)/,
];

/** Strip the leading /xx or /xx-XX locale segment. */
function stripLocale(p: string): string {
  return p.replace(
    /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '',
  ) || '/';
}

const handleI18n = createMiddleware(routing);

/**
 * Next.js 16 proxy (replaces the deprecated middleware
 * convention). Runs the auth gate first, then delegates
 * to next-intl's locale detection and rewriting.
 *
 * Auth gate: redirects guests to /sso/login when they
 * hit a protected path. Cookie validity is verified by
 * the backend on first API call; the proxy only checks
 * presence to avoid a per-request round trip.
 *
 * @param request - The incoming server request.
 * @returns A response (redirect or i18n-rewritten).
 */
export function proxy(request: NextRequest) {
  const path = stripLocale(request.nextUrl.pathname);
  const needsAuth = PROTECTED.some((re) => re.test(path));
  if (needsAuth && !request.cookies.has('nextra_sso')) {
    const next = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/sso/login?next=${next}`, request.url),
    );
  }
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
