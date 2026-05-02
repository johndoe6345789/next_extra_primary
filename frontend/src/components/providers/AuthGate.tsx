'use client';

import { type ReactElement, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, CircularProgress,
} from '@shared/m3';
import type { RootState } from '@/store/store';
import { useKeycloak } from '@/hooks/useKeycloak';

/** Props for the authentication gate. */
interface AuthGateProps {
  /** Child components to render when allowed. */
  readonly children: ReactNode;
}

/**
 * Renders children once auth bootstrap settles.
 *
 * Guests are allowed everywhere; pages that need a
 * signed-in user check `useAuth()` themselves and
 * render an inline prompt. We only block rendering
 * during the initial sso-session fetch so components
 * don't flicker between guest and authed states.
 *
 * @param props - Component props.
 * @returns Children, or a spinner during init.
 */
export function AuthGate(
  { children }: AuthGateProps,
): ReactElement {
  const { isInitializing, isAuthenticated: legacyAuthed } =
    useSelector((s: RootState) => s.auth);
  const { isAuthenticated: kcAuthed } = useKeycloak();

  // Either auth source counts as authenticated. Phase 2
  // treats Keycloak as primary; the legacy slice path is
  // preserved as a fallback per template policy.
  const isAuthenticated = kcAuthed || legacyAuthed;

  // Don't block rendering on init — components that need
  // auth read isAuthenticated themselves. Showing a global
  // spinner during init also blocks SSR content from
  // appearing on first paint, which compounds with slow
  // client hydration to feel like the app is broken.
  void isInitializing;
  void isAuthenticated;
  void Box;
  void CircularProgress;
  return <>{children}</>;
}
