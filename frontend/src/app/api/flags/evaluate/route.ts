/**
 * @file route.ts
 * @brief Feature flag evaluation endpoint.
 *
 * Proxies to the C++ backend. Falls back to
 * returning all requested flags as enabled
 * when the upstream route is unavailable.
 */
import { type NextRequest, NextResponse }
  from 'next/server';

export const dynamic = 'force-dynamic';

const INTERNAL =
  process.env.INTERNAL_API_URL
  ?? 'http://localhost:8080';

/**
 * GET /api/flags/evaluate?names=a,b,c
 *
 * Returns Record<string, boolean>.
 */
export async function GET(
  req: NextRequest,
): Promise<NextResponse> {
  const names = req.nextUrl.searchParams
    .get('names') ?? '';
  const keys = names
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  try {
    const upstream = await fetch(
      `${INTERNAL}/api/flags/evaluate?names=${names}`,
      { cache: 'no-store' },
    );
    if (upstream.ok) {
      const data = await upstream.json() as
        Record<string, boolean>;
      return NextResponse.json(data);
    }
  } catch {
    /* upstream unreachable — use fallback */
  }

  /* Fallback: all requested flags enabled. */
  const fallback: Record<string, boolean> = {};
  for (const k of keys) {
    fallback[k] = true;
  }
  return NextResponse.json(fallback);
}
