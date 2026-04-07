'use client';
/**
 * Hook for checking user permission levels.
 *
 * Role hierarchy: guest < user < moderator < admin.
 * @module hooks/usePermission
 */
import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { User } from '@/types/auth';

/** All supported roles in ascending order. */
export type Role = User['role'];

/** Numeric weight for each role. */
const ROLE_LEVEL: Record<Role, number> = {
  guest: 0,
  user: 1,
  moderator: 2,
  admin: 3,
};

/**
 * Check whether a user role meets a minimum level.
 *
 * @param current - The user's current role.
 * @param required - The minimum required role.
 * @returns True if current >= required.
 */
export function hasRole(
  current: Role, required: Role,
): boolean {
  return ROLE_LEVEL[current] >= ROLE_LEVEL[required];
}

/**
 * Hook that exposes the current user's role and
 * a permission-checking function.
 *
 * @returns Object with role and can() helper.
 */
export function usePermission() {
  const user = useAppSelector(
    (state) => state.auth.user,
  );

  const role: Role = user?.role ?? 'guest';

  const can = useMemo(
    () => (required: Role) =>
      hasRole(role, required),
    [role],
  );

  return { role, can, isAdmin: role === 'admin' };
}
