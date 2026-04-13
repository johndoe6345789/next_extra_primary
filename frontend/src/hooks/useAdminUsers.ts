'use client';

import {
  useListAdminUsersQuery,
  useSetUserRoleMutation,
  useSetUserActiveMutation,
} from '@/store/api/adminApi';
import {
  useImpersonateUserMutation,
} from '@/store/api/impersonateApi';
import type { AdminUser } from
  '@/store/api/adminTypes';

/** Return type for useAdminUsers. */
export interface UseAdminUsersReturn {
  /** List of users. */
  users: AdminUser[];
  /** Change a user's role. */
  setRole: (id: string, role: string) => void;
  /** Toggle a user's active status. */
  toggleActive: (
    id: string, isActive: boolean,
  ) => void;
  /** Impersonate a user and redirect. */
  impersonate: (userId: string) => Promise<void>;
}

/**
 * Manages admin user list data and mutations.
 *
 * @returns User list and action handlers.
 */
export function useAdminUsers():
  UseAdminUsersReturn {
  const { data } = useListAdminUsersQuery({
    page: 1, perPage: 50,
  });
  const [setRoleMut] = useSetUserRoleMutation();
  const [setActiveMut] =
    useSetUserActiveMutation();
  const [impersonateMut] =
    useImpersonateUserMutation();

  const users = data?.data ?? [];

  const setRole = (
    id: string, role: string,
  ) => setRoleMut({ id, role });

  const toggleActive = (
    id: string, isActive: boolean,
  ) => setActiveMut({
    id, active: !isActive,
  });

  const impersonate = async (userId: string) => {
    await impersonateMut({ userId }).unwrap();
    window.location.href = '/app/en';
  };

  return {
    users, setRole, toggleActive, impersonate,
  };
}
