'use client';

import { type ReactElement, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  Typography,
} from '@shared/m3';
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
 * Shows a loading spinner while redirecting
 * unauthenticated users to `/login`.
 *
 * @param props - Component props.
 * @returns Children, loading, or redirect.
 */
export function AuthGate(
  { children }: AuthGateProps,
): ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (s: RootState) => s.auth?.isAuthenticated,
  );

  const stripped =
    pathname.replace(
      /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '',
    ) || '/';
  const isPublic = PUBLIC_ROUTES.some(
    (r) => stripped === r,
  );

  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
    }
  }, [isAuthenticated, isPublic, router]);

  if (!isAuthenticated && !isPublic) {
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
