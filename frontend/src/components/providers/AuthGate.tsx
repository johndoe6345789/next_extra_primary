'use client';

import {
  type ReactElement, ReactNode, useEffect,
} from 'react';
import { usePathname, useRouter } from
  'next/navigation';
import { useSelector } from 'react-redux';
import {
  Box, CircularProgress, Typography,
} from '@shared/m3';
import type { RootState } from '@/store/store';

/** Routes accessible without authentication. */
const PUBLIC_ROUTES: ReadonlyArray<string> = [
  '/',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/forgot-password',
];

/** Props for the authentication gate. */
interface AuthGateProps {
  /** Child components to render when allowed. */
  readonly children: ReactNode;
}

/**
 * Guards routes behind authentication.
 *
 * Waits for useInitAuth (isInitializing) to finish
 * its GET /api/auth/sso-session fetch before deciding
 * whether to redirect, preventing a false redirect on
 * the first render when auth state is not yet known.
 *
 * @param props - Component props.
 * @returns Children or redirect spinner.
 */
export function AuthGate(
  { children }: AuthGateProps,
): ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitializing } =
    useSelector((s: RootState) => s.auth);

  const stripped =
    pathname.replace(
      /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/,
      '',
    ) || '/';
  const locale =
    pathname.match(
      /^\/([a-z]{2}(?:-[A-Z]{2})?)/,
    )?.[1] ?? 'en';
  const isPublic = PUBLIC_ROUTES.some(
    (r) => stripped === r,
  );

  useEffect(() => {
    if (!isInitializing && !isAuthenticated && !isPublic) {
      router.replace(`/${locale}/login`);
    }
  }, [isInitializing, isAuthenticated, isPublic, router, locale]);

  if (isInitializing || (!isAuthenticated && !isPublic)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
        data-testid="auth-gate-loading"
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
