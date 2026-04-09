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
 * PersistGate in StoreProvider ensures the store
 * is rehydrated before this component renders,
 * so auth state is always available here.
 *
 * @param props - Component props.
 * @returns Children or redirect spinner.
 */
export function AuthGate(
  { children }: AuthGateProps,
): ReactElement | null {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (s: RootState) => s.auth.isAuthenticated,
  );

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
    if (!isAuthenticated && !isPublic) {
      router.replace(`/${locale}/login`);
    }
  }, [isAuthenticated, isPublic, router, locale]);

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
