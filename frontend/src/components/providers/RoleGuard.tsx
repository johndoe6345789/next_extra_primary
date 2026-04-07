'use client';
/**
 * Guard component that renders children only when
 * the current user meets the required role level.
 *
 * @module components/providers/RoleGuard
 */
import { type ReactElement, type ReactNode } from 'react';
import { Typography } from '@shared/m3';
import {
  usePermission,
  type Role,
} from '@/hooks/usePermission';

/** Props for RoleGuard. */
interface RoleGuardProps {
  /** Minimum role needed to view content. */
  readonly required: Role;
  /** Content to render when authorised. */
  readonly children: ReactNode;
  /** Optional fallback when unauthorised. */
  readonly fallback?: ReactNode;
}

/**
 * Conditionally renders children based on user role.
 *
 * @param props - Guard props.
 * @returns Children or fallback.
 */
export function RoleGuard({
  required,
  children,
  fallback,
}: RoleGuardProps): ReactElement | null {
  const { can } = usePermission();

  if (!can(required)) {
    if (fallback) return <>{fallback}</>;
    return (
      <Typography
        data-testid="role-guard-denied"
        aria-label="Access denied"
      >
        You do not have permission to view this
        page. Required role: {required}.
      </Typography>
    );
  }

  return <>{children}</>;
}
