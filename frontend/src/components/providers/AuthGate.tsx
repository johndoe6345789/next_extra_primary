'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

/** Routes accessible without authentication. */
const PUBLIC_ROUTES: ReadonlyArray<string> = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
];

/** Props for the authentication gate. */
interface AuthGateProps {
  /** Child components to render when allowed. */
  readonly children: ReactNode;
}

/**
 * Guards routes behind authentication.
 *
 * Checks Redux auth state on every pathname change.
 * If the user is unauthenticated and the current
 * route is not public, redirects to `/login`.
 *
 * @param props - Component props.
 * @returns Children or nothing during redirect.
 */
export function AuthGate({ children }: AuthGateProps): JSX.Element | null {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated,
  );

  /** Strip locale prefix for route matching. */
  const stripped = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '') || '/';

  const isPublic = PUBLIC_ROUTES.some((route) => stripped === route);

  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
    }
  }, [isAuthenticated, isPublic, router]);

  if (!isAuthenticated && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
