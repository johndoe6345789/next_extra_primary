'use client';

/**
 * Fires a page_view analytics event on every
 * route change using usePathname + useEffect.
 * @module components/providers/AnalyticsProvider
 */
import {
  useEffect,
  type ReactNode,
  type ReactElement,
} from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics }
  from '@/hooks/useAnalytics';
import EVENTS
  from '@/constants/analytics-events.json';

/** Props for AnalyticsProvider. */
interface AnalyticsProviderProps {
  /** Children to render. */
  children: ReactNode;
}

/**
 * Tracks a page_view event on every pathname
 * change. Must be a Client Component so it can
 * access the router and fire mutations.
 *
 * @param props - Provider props.
 * @returns Passthrough wrapper.
 */
export function AnalyticsProvider({
  children,
}: AnalyticsProviderProps): ReactElement {
  const pathname = usePathname();
  const { track } = useAnalytics();

  useEffect(() => {
    track(EVENTS.PAGE_VIEW, { path: pathname });
  }, [pathname, track]);

  return <>{children}</>;
}

export default AnalyticsProvider;
