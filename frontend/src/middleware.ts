import { NextResponse, type NextRequest } from 'next/server';

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

/**
 * Gate protected routes on the presence of the
 * nextra_sso HttpOnly cookie. Validity is checked
 * by the backend on first API call; here we only
 * confirm the cookie exists to avoid a 200ms round
 * trip on every request.
 */
export function middleware(req: NextRequest) {
  const path = stripLocale(req.nextUrl.pathname);
  const needsAuth = PROTECTED.some((re) => re.test(path));
  if (!needsAuth) return NextResponse.next();

  const hasSession = req.cookies.has('nextra_sso');
  if (hasSession) return NextResponse.next();

  const next = encodeURIComponent(req.nextUrl.pathname);
  const url = new URL(`/sso/login?next=${next}`, req.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/|api/|.*\\.[a-z0-9]+$).*)',
  ],
};
