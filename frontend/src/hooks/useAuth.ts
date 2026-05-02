'use client';

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { clearCredentials, setCredentials } from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from '@/store/api/authApi';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';
import { readKeycloakUser } from './keycloakUserMap';

/** Return type for the useAuth hook. */
interface UseAuthReturn {
  /** The currently authenticated user. */
  user: User | null;
  /** Whether the user is authenticated. */
  isAuthenticated: boolean;
  /** Log in with email and password. */
  login: (req: LoginRequest) => Promise<void>;
  /** Register a new account. */
  register: (req: RegisterRequest) => Promise<void>;
  /** Log out the current user. */
  logout: () => Promise<void>;
  /** Whether an auth request is in flight. */
  isLoading: boolean;
}

/**
 * Provides authentication state and actions.
 * Wraps Redux auth slice selectors and RTK Query
 * mutations for login, register, and logout.
 *
 * @returns Auth state and action helpers.
 */
export function useAuth(): UseAuthReturn {
  const dispatch = useDispatch();
  const slice = useSelector((s: RootState) => s.auth);
  // When the Keycloak nextra_sso cookie is present we
  // derive the User shape directly from the JWT claims
  // and bypass /api/auth/me entirely. Legacy state is
  // kept as a fallback.
  const kc = readKeycloakUser();
  const user: User | null = kc?.user ?? slice.user;
  const isAuthenticated =
    kc !== null || slice.isAuthenticated;
  const { isLoading } = slice;

  const [loginMut] = useLoginMutation();
  const [registerMut] = useRegisterMutation();
  const [logoutMut] = useLogoutMutation();

  const login = useCallback(
    async (req: LoginRequest) => {
      const res = await loginMut(req).unwrap();
      if (!('user' in res && 'tokens' in res)) {
        return;
      }
      dispatch(
        setCredentials({
          user: res.user,
          ...res.tokens,
        }),
      );
    },
    [loginMut, dispatch],
  );

  const register = useCallback(
    async (req: RegisterRequest) => {
      const res = await registerMut(req).unwrap();
      dispatch(
        setCredentials({
          user: res.user,
          ...res.tokens,
        }),
      );
    },
    [registerMut, dispatch],
  );

  const logout = useCallback(async () => {
    await logoutMut().unwrap();
    dispatch(clearCredentials());
  }, [logoutMut, dispatch]);

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading,
  };
}

export default useAuth;
