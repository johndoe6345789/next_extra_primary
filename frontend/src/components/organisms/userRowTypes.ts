/**
 * Types for the UserRow organism.
 * @module components/organisms/userRowTypes
 */
import type { CSSProperties } from 'react';
import type { useTranslations } from 'next-intl';

/** Shape of a user record for display. */
export interface UserRecord {
  /** Unique user identifier. */
  id: string;
  /** User email address. */
  email: string;
  /** Login username. */
  username: string;
  /** User role. */
  role: string;
  /** Whether the account is active. */
  isActive: boolean;
  /** ISO date the user was created. */
  createdAt: string;
}

/** Props for UserRow. */
export interface UserRowProps {
  /** User data to display. */
  user: UserRecord;
  /** Role change handler. */
  onRoleChange: (role: string) => void;
  /** Toggle active handler. */
  onToggleActive: () => void;
  /** Translation function. */
  t: ReturnType<typeof useTranslations>;
}

/** Row container style. */
export const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  padding: '10px 16px',
  borderRadius: 12,
  background:
    'var(--mat-sys-surface'
    + '-container, #f5f5f5)',
  marginBottom: 8,
};
