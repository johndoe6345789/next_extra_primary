'use client';

import {
  useGetImpersonationStatusQuery,
  useStopImpersonateMutation,
} from '@/store/api/impersonateApi';

/** Return type for useImpersonation. */
export interface UseImpersonationReturn {
  /** Whether the session is impersonated. */
  active: boolean;
  /** Whether stop request is in flight. */
  isLoading: boolean;
  /** Stop impersonating and redirect. */
  stopImpersonating: () => Promise<void>;
}

/**
 * Checks impersonation status and provides
 * a handler to restore the admin session.
 *
 * @returns Impersonation state and stop handler.
 */
export function useImpersonation():
  UseImpersonationReturn {
  const { data } =
    useGetImpersonationStatusQuery();
  const [stop, { isLoading }] =
    useStopImpersonateMutation();

  const active = data?.impersonating ?? false;

  const stopImpersonating = async () => {
    await stop().unwrap();
    window.location.href = '/app/en';
  };

  return { active, isLoading, stopImpersonating };
}
